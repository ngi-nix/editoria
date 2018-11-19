/*
  INHERITED
  ---
  id
  created
  updated
  deleted

  FOREIGN
  ---
  foreignId
*/

// TO DO make sure we want foreignType && foreignId ??

const Base = require('./editoriaBase')

const {
  arrayOfStringsNotEmpty,
  foreignType,
  id,
  integerPositive,
  mimetype,
  stringNotEmpty,
  uri,
} = require('./helpers').schema

class File extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'file'
  }

  static get tableName() {
    return 'File'
  }

  static get schema() {
    return {
      filename: stringNotEmpty,
      foreignId: id,
      foreignType,
      mimetype,
      referenceId: id,
      size: integerPositive,
      source: uri,
      tags: arrayOfStringsNotEmpty,
    }
  }
}

module.exports = File
