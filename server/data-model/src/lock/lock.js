// TO DO -- review foreign id and foreign type

const Base = require('../editoriaBase')
const { id } = require('../helpers').schema

const foreignType = {
  type: 'string',
  enum: ['book', 'bookCollection', 'bookComponent', 'division', 'file'],
}

class Lock extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'lock'
  }

  static get tableName() {
    return 'Lock'
  }

  // static get relationMappings() {
  //   /* TO DO -- Implement user relation? */
  // }

  static get schema() {
    return {
      type: 'object',
      required: ['foreignId', 'foreignType', 'userId'],
      properties: {
        foreignId: id,
        foreignType,
        userId: id,
      },
    }
  }
}

module.exports = Lock
