var PORT = process.env.PORT || 5000;
var express = require('express');
// import express from 'express'
var app = express();

var http = require('http');
var server = http.Server(app);

app.use(express.static('public'));

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('SELECT * FROM recipe;', (err, res) => {
  console.log("Something!")
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

server.listen(PORT, function() {
  console.log('Web server running');
  return true
});