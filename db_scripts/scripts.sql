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

CREATE TABLE recipe_app.measurement (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL 
);

CREATE TABLE recipe_app.recipeIngredientMeasurement (
  recipe_id INT REFERENCES recipe_app.recipe(id),
  ingredient_id INT REFERENCES recipe_app.recipe(id),
  measurement_id INT REFERENCES recipe_app.measurement(id),
  quantity INT NOT NULL,
  CHECK (quantity > 0)
);


INSERT INTO recipe_app.measurement (name) VALUES
('kryddmatt'),
('tesked'),
('matsked'),
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


-- INSERT INTO recipe_app.recipeIngredientMeasurement VALUES
-- (1, )