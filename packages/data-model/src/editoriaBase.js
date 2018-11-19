/*
  An extension of pubsweet's base model with some bells and whistles.
  All other Editoria models will (and should) extend this class.
*/

const BaseModel = require('@pubsweet/base-model')

class EditoriaBase extends BaseModel {
  $beforeInsert() {
    super.$beforeInsert()
    this.deleted = false
  }

  findById(id) {
    this.find(id)
  }
}

module.exports = EditoriaBase
