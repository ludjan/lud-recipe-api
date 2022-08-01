-- drop schema cascading if it exists. This will drop all connected tables
DROP SCHEMA IF EXISTS recipe_app CASCADE;

-- create schema
CREATE SCHEMA recipe_app;

CREATE TABLE recipe_app.recipe (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  portions INT
);

CREATE TABLE recipe_app.step (
  id SERIAL PRIMARY KEY,
  recipe_id INT REFERENCES recipe_app.recipe(id),
  step_number INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  CHECK (step_number > 0)
);

CREATE TABLE recipe_app.ingredient (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE recipe_app.unit (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL 
);

CREATE TABLE recipe_app.recipeIngredientUnit (
  recipe_id INT REFERENCES recipe_app.recipe(id),
  ingredient_id INT REFERENCES recipe_app.ingredient(id),
  unit_id INT REFERENCES recipe_app.unit(id),
  quantity INT NOT NULL,
  CHECK (quantity > 0),
  PRIMARY KEY (recipe_id, ingredient_id, unit_id)
);

INSERT INTO recipe_app.unit (name) VALUES
('piece'),
('spicespoon'),
('teaspoon'),
('tablespoon'),
('deciliter'),
('liter');

INSERT INTO recipe_app.ingredient (name) VALUES 
('Vatten'),
('agg'),
('Mjolk'),
('Mjol'),
('Salt'),
('Graslok'),
('Rodlok'),
('Gul lok');

INSERT INTO recipe_app.recipe (name, description) VALUES
('Goda pannkakor', 'Supergoda pannkakor'),
('Lyxig aggrora', 'Superlyxig aggrora'),
('Loksallad', 'Usch, lok');

INSERT INTO recipe_app.step (recipe_id, step_number, description) VALUES
(1, 1, 'Hall i allt mjol och halva mjolken i en bunke og vispa till det inte ar klumpar kvar'),
(1, 2, 'Ha i resten av mjolken, vispa mer, och ha i agg'),
(1, 3, 'Ha i salt, och kanske smor. Lat smeten vila 20 minuter'),
(1, 4, 'Stek i pannan och njut!');

INSERT INTO recipe_app.recipeIngredientUnit(recipe_id, ingredient_id, unit_id, quantity) VALUES
(1, 2, 1, 2),
(1, 3, 5, 4),
(1, 4, 5, 2),
(1, 5, 2, 2);

CREATE VIEW recipeIngredientSimple (recipe_id, ingredient, quantity, unit) AS 
    SELECT 
        riu.recipe_id,
        i.name AS ingredient_name,
        riu.quantity AS quantity,
        u.name AS unit_name 
    FROM
        recipe_app.recipeIngredientUnit AS riu
        JOIN recipe_app.ingredient AS i ON riu.ingredient_id = i.id
        INNER JOIN recipe_app.unit AS u ON riu.unit_id = u.id;