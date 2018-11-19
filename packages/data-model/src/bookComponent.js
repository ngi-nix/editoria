/*
  INHERITED
  ---
  id
  created
  updated
  deleted

  FOREIGN
  ---
  bookId
  divisionId
*/

const Base = require('./editoriaBase')
const { id, integerPositive, string } = require('./helpers').schema

class BookComponent extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'bookComponent'
  }

  static get tableName() {
    return 'BookComponent'
  }

  static get schema() {
    return {
      // component type (eg. 'chapter', 'part' etc) needs to be loose, as its
      // accepted values are configurable
      componentType: string,
      pagination: {
        type: 'object',
        properties: {
          left: {
            type: 'boolean',
            default: false,
          },
          right: {
            type: 'boolean',
            default: false,
          },
        },
      },
      referenceId: id,

      /*
        counters
      */
      equationCounter: integerPositive,
      figureCounter: integerPositive,
      noteCounter: integerPositive,
      pageCounter: integerPositive,
      tableCounter: integerPositive,
      wordCounter: integerPositive,
    }
  }
}

module.exports = BookComponent
