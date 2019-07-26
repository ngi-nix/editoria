const { Model } = require('objection')
const remove = require('lodash/remove')
const Base = require('../editoriaBase')
const { id, stringNotEmpty, string, targetType } = require('../helpers').schema

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
    const associatedThumbnails = await this.$relatedQuery('thumbnail')
    remove(associatedThumbnails, file => file.deleted === true)
    return associatedThumbnails[0]
  }
}

module.exports = Template
