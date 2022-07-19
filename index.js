var port = process.env.PORT || 5000;

const Joi = require('joi') // class for validation
var express = require('express');
const cors = require('cors')

const { Client } = require('pg');

var app = express();
app.use(express.json()) // make sure express parses bodies with json
app.use(cors()) // make sure we can access the api from the outside

var http = require('http');
const { response, query } = require('express');
var server = http.Server(app);

// var recipes = [ 
//   {id: 1, name: 'Korv'},
//   {id: 2, name: 'Hest'},
//   {id: 3, name: 'Mamma'}
// ]

// connect to pg database
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
client.connect();

app.get('favicon.ico'), (req, res) => {
  res.status(200).send()
}

app.get('/api/recipes', (req, res) => {

  console.log('This is the recipe page')

  client.query('SELECT * FROM recipe;', (err, query_res) => {
  
    console.log(query_res)

    var response
    
    if (err) {
      res.status(503).send(err);
    } else {
      for (let row of query_res.rows) {
        response += JSON.stringify(row);
      }
      res.status(200).send(response)
    }
    client.end();
  });

  // res.status(200).send(recipes)
})

app.use(express.static('public'));

server.listen(port, function() {
  console.log(`Web server running on Heroku machine port ${port}`);
  return true
});