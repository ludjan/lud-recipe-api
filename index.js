var port = process.env.PORT || 5000;

const Joi = require('joi') // class for validation
var express = require('express');
const cors = require('cors')

const { Client } = require('pg');

var app = express();
app.use(express.json()) // make sure express parses bodies with json
app.use(cors()) // make sure we can access the api from the outside

app.use(express.static('public'));

var http = require('http');
var server = http.Server(app);

var recipes = [ 
  {id: 1, name: 'Korv'},
  {id: 2, name: 'Hest'},
  {id: 3, name: 'Mamma'}
]

// connect to pg database
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
client.connect();

app.use('/', (req, res) => {
  console.log('This is the main page')
})

app.get('/api/recipes', (req, res) => {

  // client.query('SELECT * FROM recipe;', (err, query_res) => {
  //   console.log("Something!")
    
  //   var response
    
  //   if (err) throw err;
  //   for (let row of query_res.rows) {
  //     response(JSON.stringify(row));
  //   }
  //   res.status(200).send('Found it!')
  //   client.end();
  // });

  res.send(recipes)
})

server.listen(port, function() {
  console.log(`Web server running on Heroku machine port ${port}`);
  return true
});