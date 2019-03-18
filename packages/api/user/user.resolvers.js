const includes = require('lodash/includes')
const forEach = require('lodash/forEach')
const startsWith = require('lodash/startsWith')

const findUser = async (_, { search, exclude }, ctx, info) => {
  const allUsers = await ctx.connectors.User.fetchAll({}, ctx)
  const searchLow = search.toLowerCase()
  const res = []
  console.log('users', allUsers)

  if (searchLow.length <= 3) {
    forEach(allUsers, user => {
      if (user.admin) return
      if (
        (startsWith(user.username.toLowerCase(), searchLow) ||
          startsWith(user.surname.toLowerCase(), searchLow) ||
          startsWith(user.email.toLowerCase(), searchLow)) &&
        !includes(exclude, user.id)
      ) {
        res.push(user)
      }
    })
  } else if (searchLow.length > 3) {
    forEach(allUsers, user => {
      if (user.admin) return
      if (
        (user.username.toLowerCase().includes(searchLow) ||
          user.surname.toLowerCase().includes(searchLow) ||
          user.email.toLowerCase().includes(searchLow)) &&
        !includes(exclude, user.id)
      ) {
        res.push(user)
      }
    })
  }

  return res
}
const createEditoriaUser = async (_, { input }, ctx, info) => {
  const allUsers = await ctx.connectors.User.fetchAll({}, ctx)
  const { username, givenName, surname, email } = input
  const errors = []
  forEach(allUsers, user => {
    if (user.username === username) {
      errors.push('username')
    }
    if (user.surname === surname && user.givenName === givenName) {
      errors.push('name')
    }
    if (user.email === email) {
      errors.push('email')
    }
  })

  if (errors.length !== 0) {
    throw new Error(`User with same ${errors} already exists!`)
  }

  if (input.password) {
    input.passwordHash = await ctx.connectors.User.model.hashPassword(
      input.password,
    )
    delete input.password
  }

  return ctx.connectors.User.create(input, ctx)
}
const updateUser = async (_, { id, input }, ctx, info) => {
  if (input.password) {
    input.passwordHash = await ctx.connectors.User.model.hashPassword(
      input.password,
    )
    delete input.password
  }

  return ctx.connectors.User.update(id, input, ctx)
}

module.exports = {
  Mutation: {
    findUser,
    createEditoriaUser,
    updateUser,
  },
}
