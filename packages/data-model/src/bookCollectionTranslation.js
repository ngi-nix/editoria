/**
 * FOREIGN
 * languageId
 * collectionId
 *
 */

/*
  Model representing a translation of a BookCollection in Editoria.
  Translations might more often be useful for books and their components,
  but collections of books might have some related translatable data as well
  (eg. a description).
*/

// When creating a new book, we need a corresponding translation and one division.
// Add archived to data model diagram

const Base = require('./editoriaBase')
const { string } = require('./helpers').schema

class BookCollectionTranslation extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'bookCollectionTranslation'
  }

  static get tableName() {
    return 'BookCollectionTranslation'
  }

  static get schema() {
    return {
      title: string,
      description: string,
    }
  }
}

module.exports = BookCollectionTranslation
