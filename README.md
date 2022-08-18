# lud-recipe-api

An API for CRUDing recipes, ingredients, steps and other entites.

The API is a heroku application built with node/express js which uses postgresql for persistent storage.
Base url is currently https://lud-recipe-app.herokuapp.com

Authentication is done via Auth0

*NOTE* a 'fullRecipe' is a recipe entity with 1 or more ingredients and 1 or more steps.

- GET routes does not require authentication:
  - Get all recipes https://lud-recipe-app.herokuapp.com/api/recipes
  - Get a specific recipe https://lud-recipe-app.herokuapp.com/api/recipes/:id
  - Get all ingredients https://lud-recipe-app.herokuapp.com/api/ingredients
  - Get all units https://lud-recipe-app.herokuapp.com/api/units
  - Get full recipe (including its ingredients and steps) https://lud-recipe-app.herokuapp.com/api/fullRecipe/:id

- POST routes requires authentication:
-- Create a new ingredient https://lud-recipe-app.herokuapp.com/api/ingredients
-- Create a new full recipe (including ingredients and steps) https://lud-recipe-app.herokuapp.com/api/fullRecipe
-- Create a new unit is not available

- PUT routes requires authentication:
-- Update a fullRecipe https://lud-recipe-app.herokuapp.com/api/fullRecipe
-- Update an ingredient is not avaiable
-- Update a unit is not available

- DELETE routes requires authentication:
-- Delete a fullRecipe https://lud-recipe-app.herokuapp.com/api/fullRecipe
-- Delete an ingredient is not available
-- Delete a unit is not available
