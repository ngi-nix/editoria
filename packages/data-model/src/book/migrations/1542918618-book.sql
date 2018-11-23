-- exports.up = (knex, Promise) =>
--   Promise.all([
--     knex.schema.createTable('Book'),
--     table => {
--       table.boolean('archived')
--       table.boolean('deleted')
--     },
--   ])

-- exports.down = (knex, Promise) => Promise.all([knex.schema.dropTable('Book')])

CREATE TABLE Book (
  -- BASE
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE,

  -- EDITORIA BASE
  deleted BOOLEAN DEFAULT FALSE,

  -- FOREIGN
  collection_id UUID references Book_Collection,

  divisions JSONB NOT NULL,

  -- OWN
  archived BOOLEAN DEFAULT FALSE,
  copyright_statement TEXT,
  copyright_holder TEXT,
  copyright_year INT,
  edition INT,
  license TEXT,
  publication_date DATE,
  reference_id UUID
);
