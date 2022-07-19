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
    client.query(`SELECT * FROM recipe ORDER BY id ASC`, (error, results) => {
        if (error) throw error
        response.status(200).json(results.rows)
    })
}


const getRecipeById = (request, response) => {
    
    const id = parseInt(request.params.id)
  
    client.query(`SELECT * FROM recipe WHERE id = ${id}`, (error, results) => {
        if (error) throw error
        response.status(200).json(results.rows)
    })
}
  
const createRecipe = (request, response) => {
    const { name } = request.body
  
    client.query(`INSERT INTO users (name) VALUES ('${name})`, (error, results) => {
        if (error) throw error
        response.status(201).send(`User added with ID: ${results.insertId}`)
    })
}
  
//   const updateUser = (request, response) => {
//     const id = parseInt(request.params.id)
//     const { name, email } = request.body
  
//     client.query(
//       'UPDATE users SET name = $1, email = $2 WHERE id = $3',
//       [name, email, id],
//       (error, results) => {
//         if (error) {
//           throw error
//         }
//         response.status(200).send(`User modified with ID: ${id}`)
//       }
//     )
//   }
  
const deleteRecipe = (request, response) => {
    const id = parseInt(request.params.id)
  
    client.query(`DELETE FROM users WHERE id = ${id}`, (error, results) => {
      if (error) throw error
      response.status(200).send(`Recipe deleted with ID: ${id}`)
    })
  }
  
module.exports = {
    getRecipes,
    getRecipeById,
    createRecipe,
    // updateUser,
    deleteRecipe
}