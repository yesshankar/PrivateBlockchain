
const userManager = require('../user.js');
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

module.exports = {
    requestValidation(req, res) {

        // make sure post body contains address key in proper format
        if (req.body.address !== undefined && typeof req.body.address === "string") {

            let user = new userManager.User(req.body.address);
            let userMgr = new userManager.UserSession();

            // Check if request was made with this address before, if not create new timestamp
            userMgr.getUser(req.body.address).then((value) => {

                user = JSON.parse(value);

                let requestTime = parseInt(user.requestTimeStamp);
                let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));

                user.validationWindow = 300 - (currentTime - requestTime);

                userMgr.addUser(user.address, JSON.stringify(user)).then((value) => {
                    res.json(JSON.parse(value));
                }, (error) => res.json({"error": error}));

            }, (error) => { // request was NOT made with this address within validation window
                userMgr.addUser(user.address, JSON.stringify(user)).then((value) => {

                    setTimeout(deleteUser, (300 * 1000), JSON.parse(value).address);
    
                    res.json(JSON.parse(value));
                }, (error) => {
                    res.json({ "error": error });
                });
            });

            
        } else {
            res.send({ "error": "No address property found!, POST data is not in proper format." })
        }

    },

    validateMsgSig(req, res) {

        if (req.body.address !== undefined && req.body.signature !== undefined) {

            let userMgr = new userManager.UserSession();

            userMgr.getUser(req.body.address).then((value) => {

                let user = JSON.parse(value);
                let requestTime = parseInt(user.requestTimeStamp);
                let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));

                user.validationWindow = 300 - (currentTime - requestTime);

                let result = { "registerStar": false, "status": user }

                if (bitcoinMessage.verify(user.message, req.body.address, req.body.signature)) {

                    result.registerStar = true;
                    user.messageSignature = "valid";

                    // send back response only after record keeping the success status
                    userMgr.addUser(user.address, JSON.stringify(user)).then((value) => {
                        res.json(result);
                    }, (error) => { res.json({ "error": error }) });

                } else {

                    user.messageSignature = "invalid";

                    // send back response only after record keeping the  failed status
                    userMgr.addUser(user.address, JSON.stringify(user)).then((value) => {
                        res.json(result);
                    }, (error) => { res.json({ "error": error }) });

                }
            }, (error) => { res.json({ "error": error + " Your request has been timed out OR you didn't request for validation"}) });
        }
    }

}

function deleteUser(address){
    let sessionMgr = new userManager.UserSession();

    sessionMgr.getUser(address).then((value) => {
        let user = JSON.parse(value);

        // Remove user data only if timed out and has not validated
        if(!(user.hasOwnProperty("messageSignature") && user.messageSignature === "valid")){
            sessionMgr.removeUser(user.address);
        }
    });
}
