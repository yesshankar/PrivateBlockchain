
const routes = require('./routes');
const bodyParser = require('body-parser');
const app = require('express')();
const port = 8000;

app.use(bodyParser.json()); // it will only parse body with json fromat and assigns empty object to req.body for all other formats

// Check in all POSt request, if the body is empty or data is sent in other than JSON format.
app.post('*', (req, res, next) => {
    
    if(Object.keys(req.body).length === 0){
        res.json({"error": "Body was empty OR payload was sent in other fromat than JSON."});
    }else{
        next();
    }
});

app.use('/block', routes.blockRouter);
app.use('/stars', routes.starRouter);

app.post('/requestValidation', routes.validation.requestValidation);
app.post('/message-signature/validate', routes.validation.validateMsgSig);


// Catch all other types of requests.
app.all('*', (req, res) => {
    res.status(404).json({"error": "Not valid endpoint. 404 Not found!"});
});

app.listen(port, () => {console.log(`app is listening on http://localhost:${port}`)});
