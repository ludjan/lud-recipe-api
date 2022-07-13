var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log("First something!")

client.connect();

client.query('SELECT * FROM recipe;', (err, res) => {
  console.log("Something!")
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

app.use(express.static('public'));

server.listen(PORT, function() {
  console.log('Web server running');
  return true
});