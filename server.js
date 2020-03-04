const express = require('express');
const app = express();
const {check, validationResult} = require('express-validator');
const yelp = require('yelp-fusion');
const cors = require('cors');
const port = 3000;

//process.env.PORT allows to look on all ports.
app.listen(process.env.PORT || port, () => console.log(`Listening on port ${port}!`))

app.get('/', (req, res) => res.send('api'));
app.use(cors());
app.use(express.json());

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const apiKey = 'f8H6TbSqdQPb75EZAVK-OtQYXdhk2KPxN660yXiAwrxDUw9graGU0rko7ucAFuQcgoEqqsS0HCCkSWJWIOu8Ph-NvJCpCghkeV3uGiBW1xEoq3MACjFNsXuFquEGXXYx';
const client = yelp.client(apiKey);

app.post('/api/search',[], (req, res) => {
    var validationErrors = validationResult(req);
    if (validationErrors.isEmpty()){
        var searchTerm = {
            term: req.body.term,
            location: req.body.location
        }
        client.search(searchTerm)
        .then(response => {
            var firstResult = response.jsonBody.businesses;
            var prettyJson = JSON.stringify(firstResult, null, 4);
            var resultImage = firstResult.image_url;
            res.json(firstResult); //this data gets sent to index.html
        }).catch(e => {
            //if error
            res.send(e)
        });
    }else {
        // if errors in validation
        res.status(422).jsonp(validationErrors.array())
    }
});






