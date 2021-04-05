const Base = require('../editoriaBase')
const { stringNotEmpty, id } = require('../helpers').schema

class ServiceCallbackToken extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'serviceCallbackToken'
  }

  static get tableName() {
    return 'serviceCallbackToken'
  }

  static get schema() {
    return {
      type: 'object',
      required: ['bookComponentId', 'serviceCredentialId', 'responseToken'],
      properties: {
        bookComponentId: id,
        serviceCredentialId: id,
        responseToken: stringNotEmpty,
      },
    }
  }
}

module.exports = ServiceCallbackToken
