/**
 * FOREIGN
 * languageId
 * bookId
 *
 */

const Base = require('./editoriaBase')
const {
  arrayOfStringsNotEmpty,
  string,
  stringNotEmpty,
} = require('./helpers').schema

class BookTranslation extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'bookTranslation'
  }

  static get tableName() {
    return 'BookTranslation'
  }

  static get schema() {
    return {
      abstractContent: string,
      abstractTitle: string,
      keywords: arrayOfStringsNotEmpty,

      /*
        title
      */
      title: stringNotEmpty,
      subtitle: string,
      alternativeTitle: string,
    }
  }
}

module.exports = BookTranslation
