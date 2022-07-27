SELECT 
    riu.recipe_id,
    i.name AS ingredient_name,
    riu.quantity AS quantity,
    u.name AS unit_name 
FROM
    recipe_app.recipeIngredientUnit AS riu
    JOIN recipe_app.ingredient AS i ON riu.ingredient_id = i.id
    INNER JOIN recipe_app.unit AS u ON riu.unit_id = u.id
WHERE recipe_id = 1;