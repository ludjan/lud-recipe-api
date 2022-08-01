var port = process.env.PORT || 5000

const Joi = require('joi') // class for validation
var express = require('express')
const cors = require('cors')

const db = require('./queries')

var app = express() // use the express framework to handle dynamic responses to different pages
app.use(express.json()) // make sure express parses bodies with json
app.use(cors()) // make sure we can access the api from the outside

var http = require('http')
const { hostname } = require('os')
const { dirname } = require('path')
var server = http.Server(app)

// const recipeList = [
//   { id: 1, name: "Mat", taste: "digg", link: "recipes/1" },
//   { id: 2, name: "Drikk", taste: "usch", link: "recipes/2" },
//   { id: 3, name: "Hulda", taste: "nja", link: "recipes/3" }
// ]

app.get('/', (req, res) => {
  console.log("Api homepage was called")
  res.status(200).send("Api is running")
})

app.get('favicon.ico', (req, res) => {
  res.status(200).send()
})
app.get('/api/recipes', db.getRecipes)
app.get('/api/recipes/:id', db.getRecipeById)
app.post('/api/recipes', db.createRecipe)
app.put('/api/recipes/:id', db.updateRecipe)
app.delete('/api/recipes/:id', db.deleteRecipe)

app.get('/api/step', db.getStep)
app.get('/api/steps', db.getSteps)
// app.get('/api/steps/:id', db.getStepById)
app.post('/api/steps', db.createStep)
app.put('/api/steps/:id', db.updateStep)
app.delete('/api/steps/:id', db.deleteStep)
// app.put('/api/reorder-steps', db.reorderSteps)
app.post('/api/steps-insert', db.createStepInsert)
app.get('/api/getRecipeSteps', db.getRecipeSteps)

app.get('/api/ingredients', db.getIngredients)
// app.get('/api/recipes/:id', db.getRecipeById)
app.post('/api/ingredients', db.createIngredient)
// app.put('/api/recipes/:id', db.updateRecipe)
// app.delete('/api/recipes/:id', db.deleteRecipe)

// units
app.get('/api/units', db.getUnits)

app.get('/api/ingredientForRecipe', db.getIngredientsForRecipe)

// full recipe moreea
app.get('/api/fullRecipe/:id', db.getFullRecipe)
app.get('/api/updateFullRecipe/:id', db.updateFullRecipe)
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
