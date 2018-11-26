/*
  FOREIGN
  bookComponentId
  languageId
*/

/*
  TO DO

  Define notes schema more accurately
*/

const { Model } = require('objection')

const Base = require('../editoriaBase')
const { model: BookComponent } = require('../bookComponent')
const { model: Language } = require('../language')
const { id, string } = require('../helpers').schema

class BookComponentTranslation extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'bookComponentTranslation'
  }

  static get tableName() {
    return 'BookComponentTranslation'
  }

  static get relationMappings() {
    return {
      bookComponent: {
        relation: Model.BelongsToOneRelation,
        modelClass: BookComponent,
        join: {
          from: 'BookComponentTranslation.bookComponentId',
          to: 'BookComponent.id',
        },
      },
      language: {
        relation: Model.BelongsToOneRelation,
        modelClass: Language,
        join: {
          from: 'BookComponentTranslation.languageId',
          to: 'Language.id',
        },
      },
    }
  }

  static get schema() {
    return {
      type: 'object',
      required: ['bookComponentId', 'languageId'],
      properties: {
        bookComponentId: id,
        content: string,
        languageId: id,
        notes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              content: string,
            },
          },
        },
        title: string,
      },
    }
  }

  getBookComponent() {
    return this.$relatedQuery('bookComponent')
  }

  getLanguage() {
    return this.$relatedQuery('language')
  }
}

module.exports = BookComponentTranslation
