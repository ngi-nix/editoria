const Base = require('../editoriaBase')
const { stringNotEmpty, string } = require('../helpers').schema

class ServiceCredential extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'serviceCredential'
  }

  static get tableName() {
    return 'serviceCredential'
  }

  static get schema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        name: stringNotEmpty,
        accessToken: string,
      },
    }
  }
}

module.exports = ServiceCredential
