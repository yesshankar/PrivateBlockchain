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
            if (err) return console.log('Block ' + key + ' submission failed', err);
            resolve('Block added successfully @ height ' + key);
          })
    });
  
}

// Get data from levelDB with key
function getLevelDBData(key){
    return new Promise((resolve, reject) => {
        db.get(key, function(err, value) {
            if (err) reject('No data found for the key ' + key);
            //console.log('Value = ' + value);
            resolve(value);
          })
    });
  
}

// Add data to levelDB with value
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

module.exports = {addLevelDBData, getLevelDBData, getBlockCountInLevelDB}