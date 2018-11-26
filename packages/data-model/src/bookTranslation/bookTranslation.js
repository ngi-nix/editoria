/**
 * FOREIGN
 * languageId
 * bookId
 *
 */

const { Model } = require('objection')

const Base = require('../editoriaBase')
const { model: Book } = require('../book')
const { model: Language } = require('../language')

const {
  arrayOfStringsNotEmpty,
  id,
  string,
  stringNotEmpty,
} = require('../helpers').schema

class BookTranslation extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'bookTranslation'
  }

  static get tableName() {
    return 'BookTranslation'
  }

  static get relationMappings() {
    return {
      book: {
        relation: Model.BelongsToOneRelation,
        modelClass: Book,
        join: {
          from: 'BookTranslation.bookId',
          to: 'Book.id',
        },
      },
      language: {
        relation: Model.BelongsToOneRelation,
        modelClass: Language,
        join: {
          from: 'BookTranslation.languageId',
          to: 'Language.id',
        },
      },
    }
  }

  static get schema() {
    return {
      type: 'object',
      required: ['bookId', 'languageId', 'title'],
      properties: {
        abstractContent: string,
        abstractTitle: string,
        alternativeTitle: string,
        bookId: id,
        keywords: arrayOfStringsNotEmpty,
        languageId: id,
        subtitle: string,
        title: stringNotEmpty,
      },
    }
  }

  getBook() {
    return this.$relatedQuery('book')
  }

  getLanguage() {
    return this.$relatedQuery('language')
  }
}

module.exports = BookTranslation
