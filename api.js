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

const recipeList = [
  { id: 1, name: "Mat", taste: "digg", link: "recipes/1" },
  { id: 2, name: "Drikk", taste: "usch", link: "recipes/2" },
  { id: 3, name: "Hulda", taste: "nja", link: "recipes/3" }
]

app.set('view engine', 'ejs')

app.get('/', (req, res) => {

  console.log(recipeList)

  res.render('recipeList', { data: recipeList })
})

app.get('/recipes/:id', (req, res) => {

  const targetId = parseInt(req.params.id)
  const recipe = recipeList.find( (r) => r.id == targetId )

  res.render('recipe', { data: recipe })
})

app.get('favicon.ico', (req, res) => {
  res.status(200).send()
})

app.get('/api/recipes', db.getRecipes)

app.get('/api/recipes/:id', db.getRecipeById)

app.post('/api/recipes', db.createRecipe)

//   // validate and may return error on bad format
//   const { error } = validateRecipe(req.body)
//   if (error) {
//     console.log(error.details[0].message)
//     return res.status(400).send(`Encountered error: ${error.details[0].message}`)
//   }
//   const { name } = req.body
//   console.log(`Will try to insert new recipe ${name}`)
//   const newRecipe = db.query(
//     `INSERT INTO recipe (name) VALUES ('${name}')`, (err, query_res) => {
//     if (err) {
//       console.log(err.message) 
//       res.status(500).send(err)
//     }
//     else {
//       console.log(`Successfully created record ${name}`)
//       res.status(200).send(req.body)
//     }
//   })
// })

app.put('/api/recipes/:id', db.updateRecipe)

app.delete('/api/recipes/:id', db.deleteRecipe)

// app.delete('api/recipes/:id', (req, res) => {
  
//   // should check cache if id exists

//   const { id } = req.params
//   console.log(`Will try to remove recipe with id ${id}`)
//   const result = db.query(
//     `DELETE FROM recipe WHERE id=${id}`, (err, query_res) => {
//       if (err) {
//         console.log(err.message)
//         res.status(500).send(err)
//       }
//       else {
//         console.log(`Successfully deleted record ${query_res}`)
//         res.status(200).send('Deleted')
//       }
//     }
//   )
// })

server.listen(port, function() {
  console.log(`Web server running on ${hostname} port ${port}`)
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