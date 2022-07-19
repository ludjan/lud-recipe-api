var port = process.env.PORT || 5000

const Joi = require('joi') // class for validation
var express = require('express')
const cors = require('cors')

const client = require('./db')

var app = express() // use the express framework to handle dynamic responses to different pages
app.use(express.json()) // make sure express parses bodies with json
app.use(cors()) // make sure we can access the api from the outside

var http = require('http')
const { hostname } = require('os')
var server = http.Server(app)

// var recipes = [ 
//   {id: 1, name: 'Korv'},
//   {id: 2, name: 'Hest'},
//   {id: 3, name: 'Mamma'}
// ]

// connect to pg database
client.connect()

app.get('favicon.ico'), (req, res) => {
  res.status(200).send()
}

app.get('/api/recipes', (req, res) => {
  client.query('SELECT * FROM recipe;', (err, query_res) => {
    if (err) res.status(503).send(err)
    else res.status(200).send(query_res.rows)
  })
})

app.get('/api/recipes/:id', (req, res) => {
  const { id } = req.params
  console.log(`Will try to get recipe with id ${id}`)
  const recipe = client.query(
    `SELECT * FROM recipe WHERE id=${id}`, (err, query_res) => {
    if (err) {
      console.log(err.message)
      res.status(404).send(err)
    }
    else {
      console.log(`Successfully got record ${recipe}`)
      res.status(200).send(recipe)
    }
  })
})

app.post('/api/recipes', (req, res) => {

  // validate and may return error on bad format
  const { error } = validateRecipe(req.body)
  if (error) {
    console.log(error.details[0].message)
    return res.status(400).send(`Encountered error: ${error.details[0].message}`)
  }
  const { name } = req.body
  console.log(`Will try to insert new recipe ${name}`)
  const newRecipe = client.query(
    `INSERT INTO recipe (name) VALUES ('${name}')`, (err, query_res) => {
    if (err) {
      console.log(err.message) 
      res.status(500).send(err)
    }
    else {
      console.log(`Successfully created record ${name}`)
      res.status(200).send(req.body)
    }
  })
})

// else, serve the index page of the public dir
app.use(express.static('public'));

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
