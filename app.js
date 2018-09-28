
const blockchain = require('./simpleChain.js');
const bodyParser = require('body-parser');
const app = require('express')();
const port = 8000;

app.use(bodyParser.json()); // it will only parse body with json fromat and assigns empty object to req.body for all other formats

app.get('/block/:blockHeight', (req, res) => {
    new blockchain.Blockchain().getBlock(req.params.blockHeight).then((block) => {
        res.json(block);
    }, (error) => {
        res.json({"error": error});
    });

});

app.post('/block', (req, res) => {

    // Check if the body is empty or data is sent in other than JSON format.
    if(Object.keys(req.body).length === 0){
        res.json({"error": "Body was empty OR payload was sent in other fromat than JSON."});

    }else{
        // Check if the body key exists in the received JSON and its value is in string fromat.
        if(req.body.body !== undefined && typeof req.body.body === "string"){
            new blockchain.Blockchain().addBlock(new blockchain.Block(req.body.body))
            .then((block) => {res.json(block)}, (error) => {
                res.json({"error": error});
            });
        }else{
            res.json({"error": "Data was not received in proper format. JSON object with body as a key and its value in string format was expected."});
        }
        
    }

});

// Catch all other types of requests.
app.all('*', (req, res) => {
    res.status(404).json({"error": "Not valid endpoint. 404 Not found!"});
});

app.listen(port, () => {console.log(`app is listening on http://localhost:${port}`)});
