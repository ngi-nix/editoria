/**
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

  // static get relationMappings() {
  //   return {
  //     bookCollection: {
  //       relation: Model.BelongsToOneRelation,
  //       modelClass: BookCollection,
  //       join: {
  //         from: 'Book.collectionId',
  //         to: 'BookCollection.id',
  //       },
  //     },
  //   }
  // }

  static get schema() {
    return {
      type: 'object',
      // required: ['divisions'],
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
        copyrightStatement: string,
        copyrightYear: year,
        copyrightHolder: string,
        license: string,
      },
    }
  }

  // If no reference id is given, assume that this is a new book and create one
  $beforeInsert() {
    super.$beforeInsert()
    this.referenceId = this.referenceId || uuid()
  }

  // TO DO
  // createNewEdition() {
  //   // create new book with same ref id
  // }
}

module.exports = Book
