-- // exports.up = (knex, Promise) =>
-- //   Promise.all([
-- //     knex.schema.createTable('Book'),
-- //     table => {
-- //       table.boolean('archived')
-- //     },
-- //   ])

-- // exports.down = (knex, Promise) => Promise.all([knex.schema.dropTable('Book')])

CREATE TABLE Book (
  id UUID PRIMARY KEY,
  archived BOOLEAN,
);
