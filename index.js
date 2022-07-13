var PORT = process.env.PORT || 5000;
// var express = require('express');
import express from 'express'
var app = express();

var http = require('http');
var server = http.Server(app);

app.use(express.static('public'));

server.listen(PORT, function() {
  console.log('Web server running');
  return true
});
