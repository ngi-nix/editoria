/*
  BookCollectionTranslation: Translatable fields of a collection of books

  Translations might more often be useful for books and their components,
  but collections of books might have some related translatable data as well
  (eg. a description).
*/

const { Model } = require('objection')

const Base = require('../editoriaBase')
const { model: BookCollection } = require('../bookCollection')
const { model: Language } = require('../language')
const { id, string } = require('../helpers').schema

class BookCollectionTranslation extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'bookCollectionTranslation'
  }

  static get tableName() {
    return 'BookCollectionTranslation'
  }

  static get relationMappings() {
    return {
      bookCollection: {
        relation: Model.BelongsToOneRelation,
        modelClass: BookCollection,
        join: {
          from: 'BookCollectionTranslation.collectionId',
          to: 'BookCollection.id',
        },
      },
      language: {
        relation: Model.BelongsToOneRelation,
        modelClass: Language,
        join: {
          from: 'BookCollectionTranslation.languageId',
          to: 'Language.id',
        },
      },
    }
  }

  static get schema() {
    return {
      type: 'object',
      required: ['collectionId', 'languageId', 'title'],
      properties: {
        collectionId: id,
        description: string,
        languageId: id,
        title: string,
      },
    }
  }

  getCollection() {
    return this.$relatedQuery('bookCollection')
  }

  getLanguage() {
    return this.$relatedQuery('language')
  }
}

module.exports = BookCollectionTranslation
