const express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
const app = express();
const {
    check,
    validationResult
} = require('express-validator');
const yelp = require('yelp-fusion');
const cors = require('cors');
const port = 3000;
const {
    Pool,
    Client
} = require('pg');


app.use(express.json());
app.use(cors());
app.use(serveStatic(__dirname + "/dist"));


const pool = new Pool({
    user: 'ilio-marketing',
    host: 'localhost',
    database: 'rememberrestaurants',
})

const saveRestaurantToUser = async (client, resId, accId) => {
    let insertIntoSaved = 'INSERT INTO saved (res_id, acc_id) VALUES ($1, $2)'
    let insertIntoSavedValues = [resId, accId]
    return await client.query(insertIntoSaved, insertIntoSavedValues)
}

// gets saved when you go to this page
app.get('/api/userdata', (req, res) => {
    let query = "SELECT id, username from accounts WHERE username = $1";
    let values = ['roger'];
    pool.query(query, values)
        .then((result) => {
            res.send(result.rows[0])
        })
        .catch((err) => {
            console.log(err)
        })
})

app.get('/api/saveddata', (req, res) => {
    let query = "SELECT restaurants.*, saved.res_id from restaurants INNER JOIN saved ON restaurants.id = saved.res_id";
    pool.query(query)
        .then((result) => {
            res.send(result.rows)
        })
        .catch((err) => {
            console.log(err)
        })
})

app.post('/api/save', function (req, res) {
    (async () => {
        var usersID = 2; // get the id of the user from accounts table
        const client = await pool.connect();
        try {
            await client.query('BEGIN')
            // look for restaurant in DB before saving...
            let query = 'SELECT id from restaurants WHERE bizid = $1'
            var result = await client.query(query, [req.body.bizid])
            if (result.rows.length >= 1) {
                // if restaurant exists, save to saved table
                await saveRestaurantToUser(client, result.rows[0].id, usersID)
                await client.query('COMMIT')
            } else {
                //otherwise need to add new restaurant then save
                let addNewRestaurant = 'INSERT INTO restaurants(bizid, bizname, image, url, location, rating, numreviews) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id'
                let addNewRestaurantValues = [req.body.bizid, req.body.bizname, req.body.image, req.body.url, req.body.location, req.body.rating, req.body.numreviews]
                result = await client.query(addNewRestaurant, addNewRestaurantValues)
                await saveRestaurantToUser(client, result.rows[0].id, usersID)
                await client.query('COMMIT')
            }
        } catch (err) {
            console.log(err)
            console.log('caught error')
        } finally {
            client.release()
            res.json({
                id: result.rows[0].id
            })
        }

    })().catch((e) => {
        console.log(e.stack)
    })
})

app.post('/api/delete', function (req, res) {
    var usersID = 2; // get the id of the user from accounts table
    let query = "DELETE from saved WHERE acc_id = $1 AND res_id= $2";
    pool.query(query, [usersID, req.body.id])
        .then((result) => {
            res.send(result.rows)
        })
        .catch((err) => {
            console.log(err)
        })
})










// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const apiKey = 'f8H6TbSqdQPb75EZAVK-OtQYXdhk2KPxN660yXiAwrxDUw9graGU0rko7ucAFuQcgoEqqsS0HCCkSWJWIOu8Ph-NvJCpCghkeV3uGiBW1xEoq3MACjFNsXuFquEGXXYx';
const client = yelp.client(apiKey);

app.post('/api/search', [], (req, res) => {
    var validationErrors = validationResult(req);
    if (validationErrors.isEmpty()) {
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
    } else {
        // if errors in validation
        res.status(422).jsonp(validationErrors.array())
    }
});


//process.env.PORT allows to look on all ports.
app.listen(process.env.PORT || port, () => console.log(`Listening on port ${port}!`))