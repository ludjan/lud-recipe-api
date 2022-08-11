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

// recipe
const getRecipeById = (request, response) => {
    
    const id = parseInt(request.params.id)
    if (!(id > 0)) response.sendStatus(400)
    console.log(`Getting recipe with id ${id}`) // some comment
  
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
    if (!(id > 0)) response.sendStatus(400)
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
    if (!(id > 0)) response.sendStatus(400)
    console.log(`Deleting step with id ${stepId}`)

    client.query(
        `DELETE FROM recipe_app.recipe WHERE id = ${id} RETURNING *`, (error, results) => {
      if (error) throw error
      console.log(`Deleted record: ${results.rows[0]}`)
      response.status(200).json(results.rows[0])
    })
  }

const getStep = (request, response) => {

    const stepId = parseInt(request.query.stepId)
    if (!(stepId > 0)) response.sendStatus(400)
    console.log(`Getting step with id ${stepId}`)

    client.query(`SELECT * FROM recipe_app.step WHERE id = ${stepId}`, (error, results) => {
        if (error) throw error
        return response.status(200).json(results.rows)
    })
}

const getSteps = (request, response) => {

    console.log(`Getting all steps`)

    client.query(`SELECT * FROM recipe_app.step`, (error, results) => {
        if (error) throw error
        return response.status(200).json(results.rows)
    })
}

const getRecipeSteps = (request, response) => {
   
    const recipeId = parseInt(request.query.recipeId)
    if (!(recipeId > 0)) response.sendStatus(400)
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
    if (!(recipeId > 0)) response.sendStatus(400)
    console.log(`Trying to get ingredients for recipe with id = ${recipeId}`)
    
    client.query(`SELECT * FROM recipeIngredientSimple WHERE recipe_id = ${recipeId}`, (error, results) => {
        if (error) throw error
        response.status(200).json(results.rows)
    })
}

const getFullRecipe = (request, response) => {

    // parse and log
    const recipeId = parseInt(request.params.id)
    if (!(recipeId > 0)) {
        console.log(`RecipeId ${recipeId} was not valid`);
        response.sendStatus(400)
    }

    console.log(`Trying to get full recipe with id = ${recipeId}`)
    
    // return object
    const recipeResponse = {
        recipe: null,
        ingredients: null,
        steps: null
    }

    // Promise.all takes a list of async function calls and waits until all are complete before it returns
    Promise.all(
    [   client.query(`SELECT * FROM recipe_app.recipe WHERE id = ${recipeId}`),
        client.query(`SELECT ingredient, quantity, unit FROM recipeIngredientSimple WHERE recipe_id = ${recipeId}`),
        client.query(`SELECT step_number, description FROM recipe_app.step WHERE recipe_id = ${recipeId} ORDER BY step_number`)
    ]).then(function([recipeResults, ingredientsResults, stepResults]) {

        // catch if id does not exist
        if (recipeResults.rows[0] == null) throw error

        // prepare the response
        recipeResponse.recipe = recipeResults.rows[0]
        recipeResponse.ingredients = ingredientsResults.rows
        recipeResponse.steps = stepResults.rows

        console.log(recipeResponse)
        // hei
        // send the response 
        response.status(200).json(recipeResponse)

      }, function(error) {
        response.status(400).json(error);
      });  
}

const createFullRecipe = (request, response) => {

    console.log(request.body)

    const { recipe, ingredients, steps } = request.body

    const newRecipe = {
        recipe: null,
        ingredients: null,
        steps: null
    }

    const portionsInt = parseInt(recipe.portions)

    console.log(`Trying to insert a full recipe with name ${recipe.name}`)
  
    client.query(
        `INSERT INTO recipe_app.recipe (name, description, portions) VALUES ('${recipe.name}', '${recipe.description}', ${portionsInt}) RETURNING *`, 
        (error, results) => {
        if (error) throw error
        const id = results.rows[0].id
        // console.log(id)

        // format the recipeIngredientUnit values
        // (1,2,3,4)
        
        var insertRelationValuesStr = "";

        for (let i=0; i<ingredients.length; i++) {
            var element = ingredients[i]
            insertRelationValuesStr += `(${id}, ${element.ingredientId}, (SELECT id FROM recipe_app.unit WHERE name = '${element.unit}'), ${element.quantity})`
            if (i != ingredients.length-1) insertRelationValuesStr += `, `
        }

        // console.log(insertRelationValuesStr)

        // next queryyy
        client.query(
            `INSERT INTO recipe_app.recipeIngredientUnit (recipe_id, ingredient_id, unit_id, quantity) VALUES ${insertRelationValuesStr} RETURNING *`,
            (error, results) => {
            if (error) throw error
            console.log(results)

            var insertStepStr = "";

            for (let i=0; i<steps.length; i++) {
                var element = steps[i]
                insertStepStr += `(${id}, ${i+1}, '${element.description}')`
                if (i != steps.length-1) insertStepStr += `, `
            }

            console.log(`${insertStepStr}`)
        
            client.query(`INSERT INTO recipe_app.step (recipe_id, step_number, description) VALUES ${insertStepStr} RETURNING *`, (error, results) => {
                if (error) throw error
                // console.log(results.rows[0])
                response.status(201).json(id);
            })
        })
    })
}

const getUnits = (request, response) => {

    console.log(`Getting all units`)

    client.query(`SELECT * FROM recipe_app.unit`, (error, results) => {
        if (error) throw error
        return response.status(200).json(results.rows)
    })
}

const updateFullRecipe = (request, response) => {

    console.log(`Trying to update recipe with id ${request.params.id}`);
    const recipeId = parseInt(request.params.id);
    const recipeName = request.body.recipe.name;
    const recipeDescription = request.body.recipe.description;
    const portions = parseInt(request.body.recipe.portions)

    console.log(`id ${recipeId}`)
    console.log(`name ${recipeName}`)
    console.log(`description ${recipeDescription}`)
    console.log(`portions ${portions}`)

    const updateRecipeQuery = `
        UPDATE recipe_app.recipe
        SET  name = '${recipeName}', description = '${recipeDescription}', portions = ${portions}
        WHERE id = ${recipeId}
        RETURNING *`;

    const deleteOldRecipeIngredientUnitsQuery = `
        DELETE FROM recipe_app.recipeIngredientUnit
        WHERE recipe_id = ${recipeId}`;

    const deleteOldStepsQuery = `
        DELETE FROM recipe_app.step
        WHERE recipe_id = ${recipeId}`;
    
    // update recipe table by id
    Promise.all(
        [   
            client.query(updateRecipeQuery),
            client.query(deleteOldRecipeIngredientUnitsQuery),
            client.query(deleteOldStepsQuery)
        ])
    .then(([updateRecipeResult, deleteRecipeIngredientUnitResult, deleteOldStepsResult]) => {
        // catch if id does not exist
        
        if (updateRecipeResult.rows[0] == null) throw error

        const createNewStepsQuery = `
            INSERT INTO recipe_app.step (recipe_id, step_number, description) 
            VALUES ${getStepQueryFormat(request.body.steps, recipeId)}`;

        const createNewRecipeIngredientUnitsQuery = `
            INSERT INTO recipe_app.recipeIngredientUnit (recipe_id, ingredient_id, unit_id, quantity)
            VALUES ${getRecipeIngredientUnitFormat(request.body.ingredients, recipeId)}`;
            
        console.log(createNewStepsQuery);
        console.log(createNewRecipeIngredientUnitsQuery);

        Promise.all([
            client.query(createNewRecipeIngredientUnitsQuery),
            client.query(createNewStepsQuery)
        ]).then((queryResponse) => {
            response.status(200).json(queryResponse);
        }).catch((error) => {
            console.log(error)
            response.status(400).json(error);
        })
    })
    .catch((error) => {
        console.log(error);
        response.status(400).json(error);
    })


    // update recipeIngredientUnit table
        // remove all ingredients for this recipe
        // insert lsit of new ingredients

    // update steps table
        // remove all steps for this recipe
        // insert list of new steps

}

function getStepQueryFormat(stepArray, recipeId) {
    var formattedValues = '';
    for (let i=0; i<stepArray.length; i++) {
        formattedValues += `(${recipeId}, ${i+1}, '${stepArray[i].description}')`;
        if (i != stepArray.length-1) formattedValues += ', ';
    }
    return formattedValues;
}

function getRecipeIngredientUnitFormat(ingredientArray, recipeId) {
    var formattedValues = '';
    for (let i=0; i<ingredientArray.length; i++) {
        const element = ingredientArray[i];
        // formattedValues += `(${recipeId}, (SELECT id FROM recipe_app.ingredient WHERE name = '${element.name}'), (SELECT id FROM recipe_app.unit WHERE name = '${element.unit}'), ${element.quantity})`;
        formattedValues += `(${recipeId}, ${element.ingredientId}, (SELECT id FROM recipe_app.unit WHERE name = '${element.unit}'), ${element.quantity})`;
        if (i != ingredientArray.length-1) formattedValues += ', ';
    }
    return formattedValues;
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
    updateFullRecipe,
    createFullRecipe,
    getUnits
}