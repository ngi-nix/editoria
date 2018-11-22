/**
 * ALREADY THERE
 * id
 * created
 * updated
 * deleted
 *
 * FOREIGN KEYS
 * collectionId
 * contributors
 * funding
 */

/*
  Model representing a single book in Editoria.
*/

// When creating a new book, we need a corresponding translation and one division.
// Add archived to data model diagram

const Base = require('../editoriaBase')
const {
  booleanDefaultFalse,
  date,
  id,
  string,
  year,
} = require('../helpers').schema

class Book extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'book'
  }

  static get tableName() {
    return 'Book'
  }

  static get schema() {
    return {
      type: 'object',
      properties: {
        archived: booleanDefaultFalse,
        divisions: {
          type: 'array',
          items: id,
          minItems: 1,
        },
        referenceId: id,
        publicationDate: date,
        edition: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
        },
        'copyright-statement': string,
        'copyright-year': year,
        'copyright-holder': string,
        license: string,
      },
    }
  }
}

module.exports = Book
