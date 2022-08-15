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
app.use(helmet()); // add Helmet to enhance API security
app.use(express.json()) // let express parses request bodies with json
app.use(cors()) // make sure we can access the API from the outside
app.use(morgan('combined')); // let morgan log HTTP requests to terminal

var server = http.Server(app)

// list harmless requests
app.get('/', (req, res) => {
  console.log("Api homepage was called")
  res.status(200).send("Api is running")
})

// removing this gives console error
app.get('favicon.ico', (req, res) => {
  res.status(200).send()
})

app.get('/api/recipes', db.getRecipes)
// app.get('/api/recipes/:id', db.getRecipeById)

app.get('/api/step', db.getStep)
app.get('/api/steps', db.getSteps)
app.get('/api/getRecipeSteps', db.getRecipeSteps)

app.get('/api/ingredients', db.getIngredients)
app.get('/api/units', db.getUnits); // get all Units
app.get('/api/ingredientForRecipe', db.getIngredientsForRecipe) // get ingredients for specific recipe

// all requests after this will be intercepted and checked before handled
app.use(checkJwt);

app.post('/api/recipes', db.createRecipe)
app.put('/api/recipes/:id', db.updateRecipe)
app.delete('/api/recipes/:id', db.deleteRecipe)
app.post('/api/steps', db.createStep)
app.put('/api/steps/:id', db.updateStep)
app.delete('/api/steps/:id', db.deleteStep)
app.post('/api/steps-insert', db.createStepInsert)
app.post('/api/ingredients', db.createIngredient)

// full recipe more
app.get('/api/fullRecipe/:id', db.getFullRecipe)
app.put('/api/fullRecipe/:id', db.updateFullRecipe)
app.post('/api/fullRecipe', db.createFullRecipe)

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
