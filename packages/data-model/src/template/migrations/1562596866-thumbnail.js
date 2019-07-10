exports.up = async knex =>
  knex.schema.table('template', table => {
    table.uuid('thumbnailId').references('file')
  })
