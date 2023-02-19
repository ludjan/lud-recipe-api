var port = process.env.PORT || 5000

// dependencies
const Joi = require('joi'); // class for validation
var express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
var http = require('http');
const { hostname } = require('os');
const { dirname } = require('path');

// source files
const db = require('./source/queries');
const { checkJwt } = require('./source/jwks-check')

// use middleware
var app = express() // use the express framework to handle dynamic responses to different pages
app.use(cors()) // make sure we can access the API from the outside
app.use(helmet()); // add Helmet to enhance API security
app.use(express.json()) // let express parses request bodies with json
app.use(morgan('combined')); // let morgan log HTTP requests to terminal

var server = http.Server(app)

// list harmless requests
app.get('/', (req, res) => {
  console.log("Api homepage was called")
  res.status(200).send("Api is running")
})


// // removing this gives console error. Dunno why (?)
// app.get('favicon.ico', (req, res) => {
//   res.status(200).send()
// })

// app.get('/api/recipes', db.getRecipes)
// app.get('/api/recipes/:id', db.getRecipeById)

// app.get('/api/ingredients', db.getIngredients) 
// app.get('/api/units', db.getUnits);

// app.get('/api/fullRecipe/:id', db.getFullRecipe)

// // all requests after this will be intercepted and checked before handled
// app.use(checkJwt);

// app.post('/api/ingredients', db.createIngredient)
// // should have route for updating ingredient 
// // should have route for deleting ingredient

// app.put('/api/fullRecipe/:id', db.updateFullRecipe)
// app.post('/api/fullRecipe', db.createFullRecipe)
// app.delete('/api/recipes/:id', db.deleteRecipe)

server.listen(port, function() {
  console.log(`API running on ${hostname} port ${port}! Woho!`)
  return true
})

function validateRecipe(recipe) {
  const schema = Joi.object({
    name: Joi.string()
        .min(3)
        .required()
  })
  return schema.validate(recipe)
}
