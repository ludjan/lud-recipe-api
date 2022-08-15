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
  id SERIAL PRIMARY KEY,
  recipe_id INT REFERENCES recipe_app.recipe(id),
  ingredient_id INT REFERENCES recipe_app.ingredient(id),
  unit_id INT REFERENCES recipe_app.unit(id),
  quantity INT NOT NULL,
  CHECK (quantity > 0)
);

INSERT INTO recipe_app.unit (name) VALUES
('piece'),
('spice spoon'),
('tea spoon'),
('table spoon'),
('milliliter'),
('centiliter'),
('deciliter'),
('liter'),
('gram'),
('hektogram'),
('kilogram'),
('just wing it');

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
(1, 4, 'Stek i pannan och njut!'),
(2, 1, 'Stek rødløken i en panne så den blir gjennomsiktlig'),
(2, 2, 'Rør eggene sammen med melken og ha salt i røren'),
(2, 3, 'Sku ned varmen på pannen og hell i røren'),
(2, 4, 'Rør rundt i pannen mens eggrøren stivner'),
(2, 5, 'Når du føler at røren har passe konsistens, hell den over i en skål - så den ikke står i pannen og blir for tørr');

INSERT INTO recipe_app.recipeIngredientUnit(recipe_id, ingredient_id, unit_id, quantity) VALUES
(1, (SELECT id FROM recipe_app.ingredient WHERE name = 'agg'), (SELECT id FROM recipe_app.unit WHERE name = 'piece'), 2),
(1, (SELECT id FROM recipe_app.ingredient WHERE name = 'Mjolk'), (SELECT id FROM recipe_app.unit WHERE name = 'deciliter'), 2),
(1, (SELECT id FROM recipe_app.ingredient WHERE name = 'Mjol'), (SELECT id FROM recipe_app.unit WHERE name = 'deciliter'), 2),
(1, (SELECT id FROM recipe_app.ingredient WHERE name = 'Salt'), (SELECT id FROM recipe_app.unit WHERE name = 'spice spoon'), 2),
(2, (SELECT id FROM recipe_app.ingredient WHERE name = 'agg'), (SELECT id FROM recipe_app.unit WHERE name = 'piece'), 3),
(2, (SELECT id FROM recipe_app.ingredient WHERE name = 'Mjolk'), (SELECT id FROM recipe_app.unit WHERE name = 'table spoon'), 2),
(2, (SELECT id FROM recipe_app.ingredient WHERE name = 'Rodlok'), (SELECT id FROM recipe_app.unit WHERE name = 'piece'), 1);

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