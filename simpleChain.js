/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const lvl = require('./levelDB.js');

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
  constructor(data) {
    this.hash = "",
      this.height = 0,
      this.body = data,
      this.time = 0,
      this.previousBlockHash = ""
  }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {

  // Add new block 
  addBlock(newBlock) {
    return new Promise((resolve, reject) => {
   
      this.getBlockHeight().then((height) => {
        // Check if Genesis Block exists, create if not, then add new Block
        if (height == -1) {

          let genBlock = new Block('This is the first block in chain: Genesis Block');
          genBlock.height = 0;

          genBlock.time = new Date().getTime().toString().slice(0, -3);
          genBlock.hash = SHA256(JSON.stringify(genBlock)).toString();
          lvl.addLevelDBData(0, JSON.stringify(genBlock)).then((msg) => {

            console.log('Genesis ' + msg);
            // This time Genesis Block was added, so calling again to add new Block
            this.addBlock(newBlock).then((block) => {resolve(block)});  
          });

        } else {

          // Block height
          newBlock.height = height + 1;
          // UTC timestamp
          newBlock.time = new Date().getTime().toString().slice(0, -3);
          // previous block hash
          this.getBlock(height).then((prevBlock) => {
            newBlock.previousBlockHash = prevBlock.hash;

            // Block hash with SHA256 using newBlock and converting to a string
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

            // Adding block object to the chain
            lvl.addLevelDBData(newBlock.height, JSON.stringify(newBlock)).then((msg) => {
              console.log(msg);
              resolve(JSON.parse(JSON.stringify(newBlock)));

            }, (error) => {
              console.log(error);
              reject(error);
            });
          });
        }
      });
    });
  }

  // Get block height
  getBlockHeight() {
    return new Promise((resolve, reject) => {
      lvl.getBlockCountInLevelDB().then((blockCount) => {
        resolve(blockCount - 1);
      });
    });
  }

  // get block
  getBlock(blockHeight) {
    // return object as a single string
    return new Promise((resolve, reject) => {
      lvl.getLevelDBData(blockHeight).then((block) => {
        resolve(JSON.parse(block));
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  }

  // validate block
  validateBlock(blockHeight) {
    return new Promise((resolve, reject) => {
      // get block object
      this.getBlock(blockHeight).then((block) => {
        // get block hash
        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash === validBlockHash) {
          resolve(true);
        } else {
          console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + ' <> ' + validBlockHash);
          resolve(false);
        }

      });
    });
  }

  // Validate blockchain
  validateChain() {

    this.getBlockHeight().then((currentBlockHeight) => {

      let errorLog = [];
      for (var i = 0; i < currentBlockHeight; i++) {

        let isValid = this.validateBlock(i);
        let blockPrev = this.getBlock(i);
        let blockNext = this.getBlock(i + 1);

        Promise.all([isValid, blockPrev, blockNext]).then((results) => {
          // validate block
          if (!results[0]) {
            errorLog.push(results[1].height);
          }
          // compare blocks hash link
          let blockHash = results[1].hash;
          let previousHash = results[2].previousBlockHash;
          if (blockHash !== previousHash) {
            errorLog.push(results[1].height);
          }

          // check if all blocks has been processed to log errors
          if (results[1].height == (currentBlockHeight - 1)) {
            if (errorLog.length > 0) {
              console.log('# of Block errors = ' + errorLog.length);
              console.log('Blocks: ' + errorLog);
            } else {
              console.log('No errors detected');
            }
          }
        });

      }


    });
  }
}

module.exports = {Block, Blockchain};

/* ===== Testing Codes ========================================================
|  Codes can be tested by commenting / uncommenting appropriate section below  |
|  ===========================================================================*/

let myBlockChain = new Blockchain();

// ---------------------- Auto add blocks ------------------------------------

// (function theLoop (i) {
//   setTimeout(function () {
//       let blockTest = new Block("Test Block - " + (i + 1));
//       console.log('Block is being added every 5 seconds....');
//       myBlockChain.addBlock(blockTest);

//         i++;
//         if (i < 10) theLoop(i);
//   }, 5000);
// })(0);

// ------------------------ Add block manually ----------------------------------

// myBlockChain.addBlock(new Block('This is 1st manually added block'));

// ----------------------- Get current block height ------------------------------

// myBlockChain.getBlockHeight().then((result) => {
//   console.log(`Current block height is: ${result}`);
// });

// ------------------- Get a block detatils ---------------------------------------

// myBlockChain.getBlock(5).then((result) => {
//   console.log('\ngetBlock() method returns....\n');
//   console.log(result);
// });

// ---------------------- Validate Block -------------------------------------------

// myBlockChain.validateBlock(5).then((result) => {
//   console.log(`\nIs block valid? : ${result}`);
// });

// ------------------------ Validate Chain ------------------------------------------

// myBlockChain.validateChain();   // Does not return Promise.

// ----------------------- Tamper block data ------------------------------

// myBlockChain.getBlock(5).then((block) => {
//   block.body = 'Modified Data';
//   lvl.addLevelDBData(5, JSON.stringify(block)).then((msg) => {
//     console.log(msg);
//   });
// });

