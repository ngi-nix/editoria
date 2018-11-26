/*
  INHERITED
  ---
  created (timestamp)

  FOREIGN
  ---
  userId
*/

// TO DO -- review foreign id and foreign type

const Base = require('../editoriaBase')
const { foreignType, id } = require('../helpers').schema

class Lock extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'lock'
  }

  static get tableName() {
    return 'Lock'
  }

  static get schema() {
    return {
      foreignId: id,
      foreignType,
    }
  }
}

module.exports = Lock
