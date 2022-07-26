const { Client } = require('pg')

// instantiate and pass a config object
const client = new Client( {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})
client.connect()

const getRecipes = (request, response) => {
    console.log('Getting all recipes')
    client.query(`SELECT * FROM recipe_app.recipe ORDER BY id DESC`, (error, results) => {
        if (error) throw error
        response.status(200).json(results.rows)
    })
}


const getRecipeById = (request, response) => {
    
    const id = parseInt(request.params.id)
    console.log(`Getting recipe with id ${id}`)
  
    client.query(`SELECT * FROM recipe_app.recipe WHERE id = ${id}`, (error, results) => {
        if (error) throw error

        if (results.rows.length == 0) return response.sendStatus(404)
        response.status(200).json(results.rows[0])
    })
}
  
const createRecipe = (request, response) => {
    const { name, description } = request.body

    console.log(`Trying to insert new entry with name ${name} and description ${description}`)
  
    // returning * in postgres causes insert to return the row it inserted
    client.query(`INSERT INTO recipe_app.recipe (name, description) VALUES ('${name}', '${description}') RETURNING *`, (error, results) => {
        if (error) throw error
        console.log(results.rows[0])
        response.status(201).json(results.rows[0])
    })
}
  
const updateRecipe = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, description } = request.body
  
    console.log(`Updating entry with id ${id} to name: ${name}, description: ${description}`)

    client.query(
      `UPDATE recipe_app.recipe SET name = '${name}', description = '${description}' WHERE id = ${id} RETURNING *`,
      (error, results) => {
        if (error) throw error
        console.log(`Updated record ${results.rows[0]}`)
        response.status(200).json(results.rows[0])
    })
}
  
const deleteRecipe = (request, response) => {
    const id = parseInt(request.params.id)
  
    client.query(`DELETE FROM recipe_app.recipe WHERE id = ${id} RETURNING *`, 
    (error, results) => {
      if (error) throw error
      console.log(`Deleted record: ${results.rows[0]}`)
      response.status(200).json(results.rows[0])
    })
  }

const getStepsForRecipe = (request, response) => {

    const id = parseInt(request.params.id)
    console.log(`Getting all steps for recipe with id ${id}`)

    client.query(`SELECT * FROM recipe_app.steps WHERE recipe_id = ${id} ORDER BY id`, (error, results) => {
        if (error) throw error
        response.status(200).json(results.rows)
    })
}

const getStepsById = (request, response) => {

}

const createStep = (request, response) => {

}

const updateStep = (request, response) => {
    
}

const deleteStep = (request, response) => {
    
}
  app.get('/api/steps/:recipeId', db.getStepsForRecipe)
  app.get('/api/steps/:id', db.getStepById)
  app.post('/api/steps', db.createStep)
  app.put('/api/steps/:id', db.updateStep)
  app.delete('/api/steps/:id', db.deleteStep)



module.exports = {
    getRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getStepsForRecipe
}