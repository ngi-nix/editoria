const { pubsubManager } = require('@coko/server')
const { logger } = require('@coko/server')
const filter = require('lodash/filter')

const {
  TEAM_MEMBERS_UPDATED,
  BOOK_PRODUCTION_EDITORS_UPDATED,
} = require('./consts')

const eager = '[members.[user, alias]]'

const getBookTeams = async (_, { bookId }, ctx) => {
  try {
    const allTeams = await ctx.connectors.Team.fetchAll({}, ctx, { eager })
    const bookTeams = filter(allTeams, team => {
      if (team.objectId) {
        return team.objectId === bookId && team.global === false
      }
      return false
    })
    logger.info(
      `Found ${bookTeams.length} teams for the book with id ${bookId}`,
    )

    return bookTeams
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const getGlobalTeams = async (_, __, ctx) => {
  const allTeams = await ctx.connectors.Team.fetchAll({}, ctx, { eager })
  const globalTeams = filter(allTeams, { global: true })
  return globalTeams
}

const updateTeamMembers = async (_, { id, input }, ctx) => {
  try {
    const pubsub = await pubsubManager.getPubsub()
    const updatedTeam = await ctx.connectors.Team.update(id, input, ctx, {
      unrelate: false,
      eager: 'members.user.teams',
    })
    logger.info(`Team with id ${id} updated`)

    const userMembers = await ctx.connectors.User.fetchSome(
      updatedTeam.members.map(member => member.user.id),
      ctx,
      { eager },
    )

    if (updatedTeam.global === true) {
      pubsub.publish(TEAM_MEMBERS_UPDATED, {
        teamMembersUpdated: {
          bookId: null,
          teamId: id,
          members: userMembers,
          role: updatedTeam.role,
          global: true,
        },
      })

      return updatedTeam
    }

    if (updatedTeam.role === 'productionEditor') {
      pubsub.publish(BOOK_PRODUCTION_EDITORS_UPDATED, {
        productionEditorsUpdated: {
          bookId: updatedTeam.objectId,
          teamId: id,
          role: updatedTeam.role,
          members: userMembers,
        },
      })
    }
    pubsub.publish(TEAM_MEMBERS_UPDATED, {
      teamMembersUpdated: {
        bookId: updatedTeam.objectId,
        teamId: id,
        role: updatedTeam.role,
        members: userMembers,
      },
    })
    logger.info(`Update msg broadcasted`)
    return updatedTeam
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

module.exports = {
  Query: {
    getBookTeams,
    getGlobalTeams,
  },
  Mutation: {
    updateTeamMembers,
  },
  Subscription: {
    teamMembersUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(TEAM_MEMBERS_UPDATED)
      },
    },
    productionEditorsUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_PRODUCTION_EDITORS_UPDATED)
      },
    },
  },
}
