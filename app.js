const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.listen(port, () => console.log(`Listening on port ${port}!`))

//load images
app.use(express.static('public'));

const yelp = require('yelp-fusion');

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const apiKey = 'f8H6TbSqdQPb75EZAVK-OtQYXdhk2KPxN660yXiAwrxDUw9graGU0rko7ucAFuQcgoEqqsS0HCCkSWJWIOu8Ph-NvJCpCghkeV3uGiBW1xEoq3MACjFNsXuFquEGXXYx';

app.use(express.urlencoded());

const client = yelp.client(apiKey);

app.post('/search', (req, res) => {
    var restaurantName = req.body.restaurant;
    var restaurantLocation = req.body.location;
    searchTerm = {
        term: restaurantName,
        location: restaurantLocation
    }
    client.search(searchTerm).then(response => {
        var firstResult = response.jsonBody.businesses;
        var prettyJson = JSON.stringify(firstResult, null, 4);
        var resultImage = firstResult.image_url;
        res.send(firstResult); //this data gets sent to index.html
        }).catch(e => {
        res.send(e);
        });
});

app.post('/results', (req, res) => {
    res.send('hello');
    
});




