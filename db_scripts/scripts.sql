DROP TABLE IF EXISTS recipe;

CREATE TABLE recipe (
  id serial PRIMARY KEY,
  name VARCHAR ( 50 ) UNIQUE NOT NULL,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO recipe (name)
VALUES
  ('Korvstroganoff'),
  ('Spagetthi'),
  ('Pizza');
