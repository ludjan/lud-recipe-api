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

const getSteps = (request, response) => {

    if (request.query.stepId != null) {

        const stepId = parseInt(request.query.stepId)
        console.log(`Getting step with id ${stepId}`)
    
        client.query(`SELECT * FROM recipe_app.step WHERE id = ${stepId}`, (error, results) => {
            if (error) throw error
            return response.status(200).json(results.rows)
        })
    }

    if (request.query.recipeId != null) {
        
        const recipeId = parseInt(request.query.recipeId)
        console.log(`Getting all steps for recipe with id ${recipeId}`)
        
        client.query(`SELECT * FROM recipe_app.step WHERE recipe_id = ${recipeId} ORDER BY step_number`, (error, results) => {
            if (error) throw error
            return response.status(200).json(results.rows)
        })
    }
}

const getStepById = (request, response) => {
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

const updateStep = (request, response) => {
    
}

// const reorderSteps = (request, response) => {
//     const { recipeId, steps } = request.body

//     for (let i = 1; i <= steps.length; i++) {
//         client.query(`UPDATE recipe_app.step SET step_number = '${i}' WHERE id = ${steps[i].id}`, (error, results) => {
//             if (error) throw error
//             console.log(results.rows[0])
//         })
//     }

//     client.query(`SELECT * FROM recipe_app.step WHERE recipe_id = ${recipeId} ORDER BY step_number`, (error, results) => {
//         if (error) throw error
//         return response.status(200).json(results.rows)
//     })



// }

const deleteStep = (request, response) => {
    
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

module.exports = {
    getRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getSteps,
    // getStepById,
    createStep,
    updateStep,
    deleteStep,
    createIngredient,
    getIngredients,
    getIngredientsForRecipe,
    getFullRecipe
}