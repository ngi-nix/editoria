// TO DO -- review foreign id and foreign type

const Base = require('../editoriaBase')
const { stringNotEmpty, object } = require('../helpers').schema

class ApplicationParameter extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'applicationParameter'
  }

  static get tableName() {
    return 'application_parameters'
  }

  static get schema() {
    return {
      type: 'object',
      required: ['stringNotEmpty'],
      properties: {
        context: stringNotEmpty,
        area: stringNotEmpty,
        config: object,
      },
    }
  }
}

module.exports = ApplicationParameter
