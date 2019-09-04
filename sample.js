'use strict';

const yelp = require('yelp-fusion');

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const apiKey = 'f8H6TbSqdQPb75EZAVK-OtQYXdhk2KPxN660yXiAwrxDUw9graGU0rko7ucAFuQcgoEqqsS0HCCkSWJWIOu8Ph-NvJCpCghkeV3uGiBW1xEoq3MACjFNsXuFquEGXXYx';

var searchRequest = {
  term:'Four Barrel Coffee',
  location: 'san francisco, ca'
};
app.use(express.urlencoded());
app.post('/search', (req, res) => {
    var restaurantName = req.body.restaurant;
    res.end()
})

const client = yelp.client(apiKey);

client.search(searchRequest).then(response => {
  var firstResult = response.jsonBody.businesses[0];
  var prettyJson = JSON.stringify(firstResult, null, 4);
  console.log(prettyJson);
  console.log(restaurantName);
}).catch(e => {
  console.log(e);
});


