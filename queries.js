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
    console.log(`Deleting step with id ${stepId}`)

    client.query(`DELETE FROM recipe_app.recipe WHERE id = ${id} RETURNING *`, 
    (error, results) => {
      if (error) throw error
      console.log(`Deleted record: ${results.rows[0]}`)
      response.status(200).json(results.rows[0])
    })
  }

const getStep = (request, response) => {

    const stepId = parseInt(request.query.stepId)
    console.log(`Getting step with id ${stepId}`)

    client.query(`SELECT * FROM recipe_app.step WHERE id = ${stepId}`, (error, results) => {
        if (error) throw error
        return response.status(200).json(results.rows)
    })
}

const getSteps = (request, response) => {

    const stepId = parseInt(request.query.stepId)
    console.log(`Getting step with id ${stepId}`)

    client.query(`SELECT * FROM recipe_app.step WHERE id = ${stepId}`, (error, results) => {
        if (error) throw error
        return response.status(200).json(results.rows)
    })
}

const getRecipeSteps = (request, response) => {
   
    const recipeId = parseInt(request.query.recipeId)
    console.log(`Getting all steps for recipe with id ${recipeId}`)
    
    client.query(`SELECT * FROM recipe_app.step WHERE recipe_id = ${recipeId} ORDER BY step_number`, (error, results) => {
        if (error) throw error
        return response.status(200).json(results.rows)
    })

}

const createStep = (request, response) => {

    const { recipeId, step_number, description } = request.body
    console.log(`Trying to insert new step for recipe with id ${recipeId}`)
  
    client.query(`INSERT INTO recipe_app.step (recipe_id, step_number, description) VALUES ('${recipeId}', '${step_number}','${description}') RETURNING *`, (error, results) => {
        if (error) throw error
        console.log(results.rows[0])
        response.status(201).json(results.rows[0])
    })
}

const updateStep = (request, response) => { }

const deleteStep = (request, response) => { }

const createStepInsert = (request, response) => {
    
    const { recipeId, step_number, description } = request.body
    console.log(`Trying to insert ${description} as step ${step_number} for recipeId ${recipeId}`)

    Promise.all(
        [   client.query(`
                UPDATE recipe_app.recipe
                SET step_number = step_number + 1 
                WHERE id = ${recipeId} AND step_number >= ${step_number}`
            ),
            client.query(`
                INSERT INTO recipe_app.step (recipe_id, step_number, description) 
                VALUES ('${recipeId}', '${step_number}','${description}') RETURNING *`
            )
        ]).then(function([updateResults, insertResults]) {
            
            response.status(200).json(insertResults.rows[0]);
          }, function(error) {
            throw error;
          });  

}

const getIngredients = (request, response) => {
    
    console.log('Getting all recipes')
    
    client.query(`SELECT * FROM recipe_app.ingredient`, (error, results) => {
        if (error) throw error
        response.status(200).json(results.rows)
    })
}

const createIngredient = (request, response) => {
    
    const { name } = request.body

    console.log(`Trying to insert new entry with name ${name}`)
  
    client.query(`INSERT INTO recipe_app.ingredient (name) VALUES ('${name}') RETURNING *`, (error, results) => {
        if (error) throw error
        console.log(results.rows[0])
        response.status(201).json(results.rows[0])
    })
}

const getIngredientsForRecipe = (request, response) => {
    
    const recipeId = parseInt(request.query.recipeId)
    console.log(`Trying to get ingredients for recipe with id = ${recipeId}`)
    
    client.query(`SELECT * FROM recipeIngredientSimple WHERE recipe_id = ${recipeId}`, (error, results) => {
        if (error) throw error
        response.status(200).json(results.rows)
    })
}

const getFullRecipe = (request, response) => {
    
    const recipeId = parseInt(request.params.id)
    console.log(`Trying to get full recipe with id = ${recipeId}`)
    
    const recipeResponse = {
        recipe: null,
        ingredients: null,
        steps: null
    }

    Promise.all(
    [   client.query(`SELECT * FROM recipe_app.recipe WHERE id = ${recipeId}`),
        client.query(`SELECT ingredient, quantity, unit FROM recipeIngredientSimple WHERE recipe_id = ${recipeId}`),
        client.query(`SELECT step_number, description FROM recipe_app.step WHERE recipe_id = ${recipeId} ORDER BY step_number`)
    ]).then(function([recipeResults, ingredientsResults, stepResults]) {
        if (recipeResults.rows[0] == null) throw error

        recipeResponse.recipe = recipeResults.rows[0]
        recipeResponse.ingredients = ingredientsResults.rows
        recipeResponse.steps = stepResults.rows

        response.status(200).json(recipeResponse);
      }, function(error) {
        throw error;
      });  
}

const updateFullRecipe = (request, response) => {
    
    const newIngredients = [ 'horse', 'pig', 'cow' ]
    console.log(newIngredients)
    
    var str = ""
    newIngredients.forEach(ingredient => {
        str += `('${ingredient}'),`
    })
    removedLastCommaStr = str.substring(0, str.length-1)

    console.log(str)
    console.log(removedLastCommaStr)

    // const sql = `INSERT INTO recipe_app.ingredient (name) VALUES ${removedLastCommaStr}`

    client.query(`INSERT INTO recipe_app.ingredient (name) VALUES ${removedLastCommaStr}`, (error, results) => {
        if (error) throw error
        response.status(200).json(results.rows)
    })

    // const recipeId = parseInt(request.params.id)
    // console.log(`Trying to get full recipe with id = ${recipeId}`)
    
    // const recipeResponse = {
    //     recipe: null,
    //     ingredients: null,
    //     steps: null
    // }

    // Promise.all(
    // [   client.query(`SELECT * FROM recipe_app.recipe WHERE id = ${recipeId}`),
    //     client.query(`SELECT ingredient, quantity, unit FROM recipeIngredientSimple WHERE recipe_id = ${recipeId}`),
    //     client.query(`SELECT step_number, description FROM recipe_app.step WHERE recipe_id = ${recipeId} ORDER BY step_number`)
    // ]).then(function([recipeResults, ingredientsResults, stepResults]) {
    //     if (recipeResults.rows[0] == null) throw error

    //     recipeResponse.recipe = recipeResults.rows[0]
    //     recipeResponse.ingredients = ingredientsResults.rows
    //     recipeResponse.steps = stepResults.rows

    //     response.status(200).json(recipeResponse);
    //   }, function(error) {
    //     throw error;
    //   });  
}

module.exports = {
    getRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getStep,
    getSteps,
    createStep,
    getRecipeSteps,
    updateStep,
    deleteStep,
    createStepInsert,
    createIngredient,
    getIngredients,
    getIngredientsForRecipe,
    getFullRecipe,
    updateFullRecipe
}