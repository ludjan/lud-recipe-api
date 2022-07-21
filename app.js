var port = process.env.PORT || 5001

var express = require('express')
const cors = require('cors')
var http = require('http')
const { hostname } = require('os')

var app = express() // use the express framework to handle dynamic responses to different pages
app.use(express.json()) // make sure express parses bodies with json
app.use(cors()) // make sure we can access the api from the outside


var server = http.Server(app)

const recipeList = [
    { id: 1, name: "Mat", taste: "digg", link: "recipes/1" },
    { id: 2, name: "Drikk", taste: "usch", link: "recipes/2" },
    { id: 3, name: "Hulda", taste: "nja", link: "recipes/3" }
  ]

server.listen(port, function() {
    console.log(`Web server running on ${hostname} port ${port}`)
    return true
  })