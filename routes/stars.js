
const blockchain = require('../simpleChain.js');
const starRouter = require('express').Router();

starRouter.get('/address::address', (req, res) => {

    new blockchain.Blockchain().getBlockByAddress(req.params.address)
    .then((value) => {
        res.json(value);
    }, (error) => {
        res.json({"error": error});
    }).catch((error) => {
        res.json({"message": "Could not complete request. Unexpeceted error occured", "error": error});
    });   

});

starRouter.get('/hash::hash', (req, res) => {
    new blockchain.Blockchain().getBlockByHash(req.params.hash)
    .then((value) => {
        res.json(value);
    }, (error) => {
        res.json({"error": error});
    }).catch((err) => {
        res.json({"message": "Could not complete request. Unexpeceted error occured", "error": err});
    });

});

module.exports= starRouter;



