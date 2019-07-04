const { Model } = require('./node_modules/objection')

const Base = require('../editoriaBase')
const { arrayOfIds, id, stringNotEmpty, string } = require('../helpers').schema

class Template extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'template'
  }

  static get tableName() {
    return 'Template'
  }

  static get schema() {
    return {
      type: 'object',
      required: ['templateName'],
      properties: {
        templateName: stringNotEmpty,
        referenceId: id,
        author: string,
        thumbnailId: id,
        bookId: id,
        files: arrayOfIds,
      },
    }
  }

  static get relationMappings() {
    const { model: File } = require('../file')

    return {
      files: {
        relation: Model.HasManyRelation,
        modelClass: File,
        join: {
          from: 'File.templateId',
          to: 'Template.id',
        },
      },
      thumbnail: {
        relation: Model.BelongsToOneRelation,
        modelClass: File,
        join: {
          from: 'Template.thumbnailId',
          to: 'File.id',
        },
      },
    }
  }

  getFiles() {
    return this.$relatedQuery('files')
  }
}

module.exports = Template
