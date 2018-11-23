const getBookTeams = async (_, args, ctx) => {
  const teams = await ctx.models.team
    .findByBookId({ bookId: args.bookId })
    .exec()

  if (!teams) {
    throw new Error(`No teams found for the book with id: ${args.bookId}`)
  }

  return teams
}

const getGlobalTeams = async (_, __, ctx) => {
  const teams = await ctx.models.team.find({ global: true }).exec()

  if (!teams) {
    throw new Error(`No  global teams found`)
  }

  return teams
}

const updateTeamMembers = async (_, args, ctx) => {
  const updatedTeam = await ctx.models.team
    .update({ id: args.input.id, members: args.input.members })
    .exec()
  return updatedTeam
}

module.exports = {
  Query: {
    getBookTeams,
    getGlobalTeams,
  },
  Mutation: {
    updateTeamMembers,
  },
}
