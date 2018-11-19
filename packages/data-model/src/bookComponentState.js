/*
  FOREIGN
  bookComponentId
  comments -> userId

  // uploading should only be on local storage?
  uploading

  comments
*/

// TO DO -- resolve user name when getting comments

const Base = require('./editoriaBase')
const { booleanDefaultFalse, object } = require('./helpers').schema

class BookComponentState extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'bookComponentState'
  }

  static get tableName() {
    return 'BookComponentState'
  }

  static get schema() {
    return {
      comments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            //  TODO FOREIGN userId:
            content: {
              type: 'String',
              minLength: 1,
            },
          },
        },
      },
      // left loose on purpose to allow for configurability
      workflowStages: object,
      trackChangesEnabled: booleanDefaultFalse,
    }
  }
}

module.exports = BookComponentState
