/*
  FOREIGN
  ---
  languageId
  fileId
*/

const Base = require('./editoriaBase')
const { string } = require('./helpers').schema

class FileTranslation extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'fileTranslation'
  }

  static get tableName() {
    return 'FileTranslation'
  }

  static get schema() {
    return {
      alt: string,
      description: string,
    }
  }
}

module.exports = FileTranslation
