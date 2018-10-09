/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addLevelDBData(key,value){
    return new Promise((resolve, reject) => {
        db.put(key, value, function(err) {
            if (err) reject('Block ' + key + ' submission failed');
            resolve('Block added successfully @ height ' + key);
          })
    });
  
}

// Get data from levelDB with key
function getLevelDBData(key){
    return new Promise((resolve, reject) => {
        db.get(key, function(err, value) {
            if (err) reject('No block found @ block height = ' + key);
            
            let parsedData = JSON.parse(value);

            // Make sure it is not a Genesis Block ( as it contains only simple string in body)
            if(parsedData.body.hasOwnProperty("star")){
                // Decode story and add storyDecoded field in story property
                parsedData.body.star.storyDecoded = Buffer.from(parsedData.body.star.story, 'hex').toString();
            }

            resolve(parsedData);
          })
    });
  
}

// Get block height by counting number of data entry in level db
function getBlockCountInLevelDB() {
    return new Promise((resolve, reject) => {
        let i = 0;
        db.createReadStream().on('data', function(data) {
            i++;
            }).on('error', function(err) {
                return console.log('Unable to read data stream!', err)
            }).on('close', function() {
            //console.log('Block #' + i);
            resolve(i);
            });
    });
    
}

function getDataByAddress(address){
    return new Promise((resolve, reject) => {

        let blocks = [];

        db.createValueStream().on('data', (data) => {
            let parsedData = JSON.parse(data);

            if(parsedData.body.hasOwnProperty("address") && parsedData.body.address === address){ 

                // Decode story and add storyDecoded field in story property
                parsedData.body.star.storyDecoded = Buffer.from(parsedData.body.star.story, 'hex').toString();

                blocks.push(parsedData);               
            }

        }).on('error', (err) => {
            reject('Unable to read data stream ' + err);
        }).on('close', () => {

            resolve(blocks);
        });
    });

}

function getDataByHash(hash){
    return new Promise((resolve, reject) => {

        let result = null;

        db.createValueStream().on('data', (data) => {
            let parsedData = JSON.parse(data);

            if(parsedData.hash === hash){

                // Make sure it is not a Genesis Block ( as it contains only simple string in body)
                if(parsedData.body.hasOwnProperty("star")){
                    // Decode story and add storyDecoded field in story property
                    parsedData.body.star.storyDecoded = Buffer.from(parsedData.body.star.story, 'hex').toString();
                }
                
                result = parsedData;
            }

        }).on('error', (err) => {
            reject('Unable to read data stream ' + err);
        }).on('close', () => {

            if(result != null){
                resolve(result);
            }else{
                reject('Data with hash ' + hash + ' not found');
            }
            
        });
    });
}

module.exports = {addLevelDBData, getLevelDBData, getBlockCountInLevelDB, getDataByAddress, getDataByHash}