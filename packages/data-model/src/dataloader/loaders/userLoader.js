const Loader = require('../loader')
const { model } = require('@pubsweet/model-user')

const UserLoader = {
  userTeams: new Loader(async id => await model.find(id, {eager: 'teams'})),
}

module.exports = UserLoader
