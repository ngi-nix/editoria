const findUser = async (_, args, ctx, info) => {
  const users = await ctx.models.user.findByTerm(args.search).exec()

  if (!users) {
    throw new Error(`No users found`)
  }

  return users
}

module.exports = {
  Query: {
    findUser,
  },
}
