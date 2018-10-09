
const level = require('level');
const userDB = level('./userData');

class User{
    constructor(walletAddress){
        this.address = walletAddress,
        this.requestTimeStamp = new Date().getTime().toString().slice(0,-3);
        this.message = walletAddress + ":" + this.requestTimeStamp + ":starRegistry",
        this.validationWindow = 300     // 300 second or 5 minute
    }
}

class UserSession{

    addUser(address, user){
        return new Promise((resolve, reject) => {
            userDB.put(address, user, (err) => {
                if(err) reject('User id ' + address + ' submission failed.');
                console.log(`User added/updated with address ${address}`);
                resolve(user);
            });
        });
    }

    getUser(address){
        return new Promise((resolve, reject) => {
            userDB.get(address, (err, value) => {
                if(err) reject('User with address ' + address + ' not found!');
                resolve(value);
            });
        });
    }

    removeUser(address){
        return new Promise((resolve, reject) => {
            userDB.del(address, (err) => {
                if(err) reject('Unable to remove user, user with address ' + address + ' not found!');
                console.log(`User removed with address ${address}`);
                resolve('User data with address ' + address + ' removed.');
            });
        });
    }

}

// Self envoking function to clear up timed out User Data that were left after sudden server shutdwon on server start up
(function clearUserDB(){
    let i = 0, j = 0;
    let userMgr = new UserSession();

    userDB.createReadStream().on('data', (data) => {
        i++;

        let user = JSON.parse(data.value);
        let requestTime = parseInt(user.requestTimeStamp);
        let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));

        user.validationWindow -= (currentTime - requestTime);

        if(user.validationWindow <= 0){
            userMgr.removeUser(data.key).then((value) => {j++});
        }
    }).on('err', (err) => {
        console.log(err);
    }).on('close', () => {
        console.log(`${i-j} requests are still active since last server shutdown, ${j} timed out user data is removed on server startup`);
    });
})();

module.exports = {User, UserSession};