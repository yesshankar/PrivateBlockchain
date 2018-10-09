
const blockchain = require('../simpleChain.js');
const userManager = require('../user.js');
const blockRouter = require('express').Router();

blockRouter.get('/:blockHeight', (req, res) => {
    new blockchain.Blockchain().getBlock(req.params.blockHeight).then((block) => {
        res.json(block);
    }, (error) => {
        res.json({ "error": error });
    });

});

blockRouter.post('/', (req, res) => {

    // Check if posted data has all required properties in proper format and story doesn't exceed 500 bytes
    checkStarObjectSchema(req.body).then((starObj) => {
        
        new userManager.UserSession().getUser(starObj.address).then((value) => {

            let user = JSON.parse(value);

            // Make sure user have the right to register the star
            if(user.hasOwnProperty("messageSignature") && user.messageSignature === "valid"){

                // Convert story to hex string before adding to the block
                starObj.star.story = Buffer.from(starObj.star.story, 'utf8').toString('hex');

                new blockchain.Blockchain().addBlock(new blockchain.Block(starObj))
                    .then((block) => {
                        // Remove user's wallet address once the star has been registered,
                        // to force new 'request validation' for another star registry.
                        new userManager.UserSession().removeUser(block.body.address);

                        res.json(block);
                    }, (error) => {
                        res.json({ "error": error });
                    });
                
            }else{
                res.json({"error": "NO valid messageSignature. Verify your wallet address with message signature."});
            }
        }, (err) => {
            res.json({"error": "Wallet address does not exist. You didn't validate your identity OR validation window timed out."});
        });




    }, (err) => {
        res.json({ "error": err });
    });

});

// Check star object schema and the byte size of star story
function checkStarObjectSchema(starObj) {
    return new Promise((resolve, reject) => {
        let errors = [];

        // Check if star object has the address property. If true then check the type of value.
        if (starObj.hasOwnProperty("address")) {
            if (typeof starObj.address !== "string") {
                errors.push(`address value was expected in string but found ${typeof starObj.address} type`);
            }
        } else {
            errors.push("address property not found");
        }

        // Check if star object has star property. If true then check the type of its value for object and so on.
        if (starObj.hasOwnProperty("star")) {
            if (typeof starObj.star === "object") {
                ["dec", "ra", "story"].forEach((key) => {
                    if (starObj.star.hasOwnProperty(key)) {
                        if (typeof starObj.star[key] !== "string") {
                            errors.push(`${key} value was expected in string but found ${typeof starObj.star[key]} type`);
                        }else{
                            // Check if story size is within limit of 500 bytes max.
                            if(key === "story"){
                                let storySize = Buffer.byteLength(starObj.star.story, 'utf8');
                                if(storySize > 500){
                                    errors.push(`Exceeds star story size limit of 500 bytes. Received ${storySize} bytes`);
                                }
                            }
                        }
                    } else {
                        errors.push(`${key} property not found`);
                    }
                });


            } else {
                errors.push(`star value was expeceted in object but found ${typeof starObj.star} type`);
            }

        } else {
            errors.push("star property not found");
        }

        // Now resolve or reject depending upon the error
        if (errors.length > 0) {
            reject(errors);
        } else {
            resolve(starObj);
        }
    });
}

module.exports = blockRouter;
