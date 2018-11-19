/*
  FOREIGN
  bookComponentId
  languageId
*/

const Base = require('./editoriaBase')
const { string } = require('./helpers').schema

class BookComponentTranslation extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'bookComponentTranslation'
  }

  static get tableName() {
    return 'BookComponentTranslation'
  }

  static get schema() {
    return {
      title: string,
      content: string,
      // TO DO define notes schema
      notes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            content: string,
          },
        },
      },
    }
  }
}

module.exports = BookComponentTranslation
