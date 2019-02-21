const includes = require('lodash/includes')
const forEach = require('lodash/forEach')
const startsWith = require('lodash/startsWith')

const findUser = async (_, { search, exclude }, ctx, info) => {
  const allUsers = await ctx.connectors.User.fetchAll({}, ctx)
  const searchLow = search.toLowerCase()
  const res = []

  if (searchLow.length === 1) {
    forEach(allUsers, user => {
      if (
        startsWith(user.username.toLowerCase(), searchLow) &&
        !includes(exclude, user.id)
      ) {
        res.push(user)
      }
      // if (startsWith(user.fullname.toLowerCase(), searchLow)&&
      // !includes(exclude, user.id)) {
      //   res.push(user)
      // }
      // if (startsWith(user.email.toLowerCase(), searchLow)&&
      // !includes(exclude, user.id)) {
      //   res.push(user)
      // }
    })
  } else if (searchLow.length > 1) {
    forEach(allUsers, user => {
      if (
        user.username.toLowerCase().includes(searchLow) &&
        !includes(exclude, user.id)
      ) {
        res.push(user)
      }
      // if (user.fullname.toLowerCase().includes(searchLow)&&
      // !includes(exclude, user.id)) {
      //   res.push(user)
      // }
      // if (user.email.toLowerCase().includes(searchLow)&&
      // !includes(exclude, user.id)) {
      //   res.push(user)
      // }
    })
  }

  return res
}

module.exports = {
  Mutation: {
    findUser,
  },
}
