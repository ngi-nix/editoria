/*
  Book: A single book
*/

/*
  TO DO
  ---
  On create, we need a corresponding translation (by default english).

  On create, we need the corresponding divisions. Divisions should be read
  from the config and fall back to a default.

  Since we cannot enforce the integrity of division ids in sql (see note there),
  we should check it here.

  Foreign keys missing: (implement when their models are done)
  - contributors
  - funding

  createNewEdition method: new book with same ref id
*/

const { Model } = require('objection')
const uuid = require('uuid/v4')

const Base = require('../editoriaBase')
const { model: BookCollection } = require('../bookCollection')

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

  static get relationMappings() {
    return {
      bookCollection: {
        relation: Model.BelongsToOneRelation,
        modelClass: BookCollection,
        join: {
          from: 'Book.collectionId',
          to: 'BookCollection.id',
        },
      },
    }
  }

  static get schema() {
    return {
      type: 'object',
      required: ['collectionId'],
      properties: {
        archived: booleanDefaultFalse,
        collectionId: id,
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
        copyrightStatement: string,
        copyrightYear: year,
        copyrightHolder: string,
        license: string,
      },
    }
  }

  $beforeInsert() {
    super.$beforeInsert()
    // If no reference id is given, assume that this is a new book & create one
    this.referenceId = this.referenceId || uuid()
  }

  getCollection() {
    return this.$relatedQuery('bookCollection')
  }
}

module.exports = Book
