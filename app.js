const express = require('express');
const app = express();
const {check, validationResult} = require('express-validator');
const cors = require('cors');
const port = 3000;


app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

//process.env.PORT allows to look on all ports.
app.listen(process.env.PORT || port, () => console.log(`Listening on port ${port}!`))

app.use(cors());
//load images
app.use(express.static('public'));

const yelp = require('yelp-fusion');

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const apiKey = 'f8H6TbSqdQPb75EZAVK-OtQYXdhk2KPxN660yXiAwrxDUw9graGU0rko7ucAFuQcgoEqqsS0HCCkSWJWIOu8Ph-NvJCpCghkeV3uGiBW1xEoq3MACjFNsXuFquEGXXYx';

app.use(express.urlencoded());

const client = yelp.client(apiKey);

app.post('/search', [
    check('restaurant').trim().escape(),
    check('location').isLength({min: 1}).trim().escape()
], (req, res) => {
    var validationErrors = validationResult(req);
    searchTerm = {
        term: req.body.restaurant,
        location: req.body.location
    }
    if (validationErrors.isEmpty()){
        client.search(searchTerm).then(response => {
            var firstResult = response.jsonBody.businesses;
            var prettyJson = JSON.stringify(firstResult, null, 4);
            var resultImage = firstResult.image_url;
            res.send(firstResult); //this data gets sent to index.html
            app.route('/results').get(function(req, res) {
                res.send(firstResult);
            })
        }).catch(e => {
            //if error
            res.status(500).jsonp(e)
        });
    }else {
        // if errors in validation
        res.status(422).jsonp(validationErrors.array())
    }
});







