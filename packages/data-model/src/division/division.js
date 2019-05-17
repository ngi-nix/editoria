/*
  TO DO

  There is a logical dead end between division and book.
  A book cannot have an empty array of divisions and it needs a valid
  division id. A division must have a valid book id.
  When creating a new one, we have a problem. One of the two conditions
  has to go.

  After creation, update book "divisions" array of ids.

  Get book components & relation
*/

const { Model } = require('objection')

const Base = require('../editoriaBase')
const { arrayOfIds, id, stringNotEmpty } = require('../helpers').schema

class Division extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'division'
  }

  static get tableName() {
    return 'Division'
  }

  static get schema() {
    return {
      type: 'object',
      required: ['bookId', 'label'],
      properties: {
        bookId: id,
        bookComponents: arrayOfIds,
        label: stringNotEmpty,
      },
    }
  }

  static get relationMappings() {
    const { model: Book } = require('../book')

    return {
      book: {
        relation: Model.BelongsToOneRelation,
        modelClass: Book,
        join: {
          from: 'Division.bookId',
          to: 'Book.id',
        },
      },
    }
  }

  getBook() {
    return this.$relatedQuery('book')
  }
}

module.exports = Division
