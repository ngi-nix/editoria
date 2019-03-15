const user = require('@pubsweet/model-user')

const User = user.model

class EditoriaUser extends User {
  $beforeInsert() {
    super.$beforeInsert()
  }

  static get schema() {
    return {
      type: 'object',
      properties: {
        givenName: {
          type: 'string',
        },
        surname: {
          type: 'string',
        },
      },
    }
  }

  static async findById(id) {
    return this.find(id)
  }
}

module.exports = EditoriaUser
