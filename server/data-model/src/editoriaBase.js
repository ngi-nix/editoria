/*
  An extension of pubsweet's base model with some bells and whistles.
  All other Editoria models will (and should) extend this class.
*/

const { BaseModel } = require('@coko/server')
// const each = require('lodash/each')

class EditoriaBase extends BaseModel {
  $beforeInsert() {
    super.$beforeInsert()
    this.deleted = false
  }

  static get schema() {
    return {
      type: 'object',
      properties: {
        deleted: {
          type: 'boolean',
          default: false,
        },
      },
    }
  }

  static async findById(id) {
    return this.find(id)
  }
}

module.exports = EditoriaBase
