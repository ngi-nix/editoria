/*
  Book: A single book
*/

/*
  TO DO
  ---
  On create, we need a corresponding translation (by default english).

  Since we cannot enforce the integrity of division ids in sql (see note there),
  we should check it here.

  Foreign keys missing: (implement when their models are done)
  - contributors
  - funding

  createNewEdition method: new book with same ref id
*/

const { Model } = require('objection')
const uuid = require('uuid/v4')
const find = require('lodash/find')

const Base = require('../editoriaBase')
const { model: BookCollection } = require('../bookCollection')
const { model: Division } = require('../division')
const { model: ApplicationParameter } = require('../applicationParameter')

const { booleanDefaultFalse, id, string, year } = require('../helpers').schema

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
          default: [],
          // minItems: 1,
        },
        referenceId: id,
        publicationDate: string,
        edition: {
          type: 'integer',
          minimum: 0,
          maximum: 100,
        },
        copyrightStatement: string,
        copyrightYear: year,
        copyrightHolder: string,
        isbn: string,
        issn: string,
        issnL: string,
        license: string,
      },
    }
  }

  async $afterInsert() {
    super.$afterInsert()

    /*
      ** Create divisions on book creation **
      If no divisions in config, make a single default 'body' division.
      Otherwise create the ones declared in the config.
    */
    const applicationParameters = await ApplicationParameter.query()
    const { config: divisions } = find(applicationParameters, {
      context: 'bookBuilder',
      area: 'divisions',
    })

    if (!divisions) {
      const division = await this.addDivision('body')
      this.divisions = [division.id]
    } else {
      const createdDivisions = await Promise.all(
        divisions.map(async division => this.addDivision(division.name)),
      )
      this.divisions = createdDivisions.map(d => d.id)
    }

    return this.save()
  }

  $beforeInsert() {
    super.$beforeInsert()
    // If no reference id is given, assume that this is a new book & create one
    this.referenceId = this.referenceId || uuid()
  }

  async addDivision(label) {
    return Division.query().insert({
      bookId: this.id,
      bookComponents: [],
      label,
    })
  }

  getCollection() {
    return this.$relatedQuery('bookCollection')
  }
}

module.exports = Book
