/**
 * ALREADY THERE
 * id
 * created
 * updated
 * deleted
 */

/*
  Model representing a collection of books in Editoria.
*/

const Base = require('./editoriaBase')

class BookCollection extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'bookCollection'
  }

  static get tableName() {
    return 'BookCollection'
  }
}

module.exports = BookCollection
