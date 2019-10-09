const { Model } = require('objection')
const remove = require('lodash/remove')
const Base = require('../editoriaBase')
const { id, stringNotEmpty, string, targetType, notesType } = require('../helpers').schema

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
      required: ['name'],
      properties: {
        name: stringNotEmpty,
        referenceId: id,
        thumbnailId: id,
        author: string,
        target: targetType,
        trimSize: string,
        notes: notesType,
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

  async getFiles() {
    const { thumbnailId } = this
    const associatedFiles = await this.$relatedQuery('files')
    if (thumbnailId) {
      remove(associatedFiles, file => file.id === thumbnailId)
    }
    remove(associatedFiles, file => file.deleted === true)
    return associatedFiles
  }
  async getThumbnail() {
    const { thumbnailId } = this
    if (thumbnailId) {
      return this.$relatedQuery('thumbnail')
    }
    return null
  }
}

module.exports = Template
