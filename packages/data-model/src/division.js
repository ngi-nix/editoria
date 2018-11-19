/*
  INHERITED
  ---
  id

  FOREIGN
  ---
  bookId
  bookComponents -> ids
*/

const Base = require('./editoriaBase')
const { arrayOfIds, stringNotEmpty } = require('./helpers').schema

class Division extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'division'
  }

  static get tableName() {
    return 'Division'
  }

  static get schema() {
    return {
      label: stringNotEmpty,
      bookComponents: arrayOfIds,
    }
  }
}

module.exports = Division
