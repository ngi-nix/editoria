const { logger } = require('@coko/server')
const map = require('lodash/map')

const { Team, TeamMember, User } = require('../../data-model/src').models

const getTeamMembers = async (teamId, options = {}) => {
  const { trx } = options
  if (!trx) {
    const teamMembers = await TeamMember.query().where({
      teamId,
      deleted: false,
    })

    if (teamMembers === 0) {
      return teamMembers
    }

    const populatedTeamMembers = await Promise.all(
      map(teamMembers, async teamMember => {
        const user = await User.query().where({
          id: teamMember.userId,
        })
        const { username, admin, email, givenName, surname } = user[0]

        return { username, admin, email, givenName, surname }
      }),
    )
    return populatedTeamMembers
  }
  const teamMembers = await TeamMember.query(trx).where({
    teamId,
    deleted: false,
  })

  if (teamMembers === 0) {
    return teamMembers
  }

  const populatedTeamMembers = await Promise.all(
    map(teamMembers, async teamMember => {
      const user = await User.query(trx).where({
        id: teamMember.userId,
      })
      const { username, admin, email, givenName, surname } = user[0]

      return { username, admin, email, givenName, surname }
    }),
  )
  return populatedTeamMembers
}

const createTeam = async (
  name,
  objectId = undefined,
  objectType = undefined,
  role,
  deleted = false,
  global = false,
  options = {},
) => {
  const { trx } = options

  if (!trx) {
    const newTeam = await Team.query().insert({
      name,
      objectId,
      objectType,
      role,
      deleted,
      global,
    })

    logger.info(`>>> team of type ${role} created with id ${newTeam.id}`)

    return newTeam
  }
  const newTeam = await Team.query(trx).insert({
    name,
    objectId,
    objectType,
    role,
    deleted,
    global,
  })

  logger.info(`>>> team of type ${role} created with id ${newTeam.id}`)

  return newTeam
}

const getEntityTeam = async (
  objectId,
  objectType,
  role,
  withTeamMembers = false,
  options = {},
) => {
  const { trx } = options
  logger.info(
    `>>> fetching team of ${objectType} with id ${objectId} and role ${role}`,
  )

  if (!trx) {
    const team = await Team.query().where({
      objectId,
      objectType,
      role,
      deleted: false,
    })

    if (team.length === 0) {
      throw new Error(
        `team of ${objectType} with id ${objectId} does not exist`,
      )
    }

    if (!withTeamMembers) {
      return team[0]
    }

    team[0].members = await getTeamMembers(team[0].id)

    return team[0]
  }

  const team = await Team.query(trx).where({
    objectId,
    objectType,
    role,
    deleted: false,
  })

  if (team.length === 0) {
    throw new Error(`team of ${objectType} with id ${objectId} does not exist`)
  }

  if (!withTeamMembers) {
    return team[0]
  }

  team[0].members = await getTeamMembers(team[0].id, { trx })

  return team[0]
}

const getEntityTeams = async (
  objectId,
  objectType,
  withTeamMembers = false,
  options = {},
) => {
  const { trx } = options
  logger.info(`>>> fetching teams of ${objectType} with id ${objectId}`)
  if (!trx) {
    const teams = await Team.query().where({
      objectId,
      objectType,
      deleted: false,
    })
    if (teams.length === 0) {
      throw new Error(`teams of ${objectType} with id ${objectId} do not exist`)
    }
    if (!withTeamMembers) {
      return teams
    }
    return Promise.all(teams, async team => {
      team.members = await getTeamMembers(team.id)
      return team
    })
  }
  const teams = await Team.query(trx).where({
    objectId,
    objectType,
    deleted: false,
  })
  if (teams.length === 0) {
    throw new Error(`teams of ${objectType} with id ${objectId} do not exist`)
  }
  if (!withTeamMembers) {
    return teams
  }
  return Promise.all(teams, async team => {
    team.members = await getTeamMembers(team.id, { trx })
    return team
  })
}

const deleteTeam = async (teamId, options = {}) => {
  const { trx } = options
  if (!trx) {
    const deletedTeam = await Team.query().patchAndFetchById(teamId, {
      deleted: false,
      objectId: null,
      objectType: null,
    })
    logger.info(`>>> associated team with id ${teamId} deleted`)
    logger.info(`>>> corresponding team's object cleaned`)

    const teamMembers = await TeamMember.query().where({
      teamId,
      deleted: false,
    })

    logger.info(`>>> fetching team members of team with id ${teamId}`)
    await Promise.all(
      map(teamMembers, async teamMember => {
        logger.info(`>>> team member with id ${teamMember.id} deleted`)
        return TeamMember.query()
          .patch({ deleted: true })
          .where({ id: teamMember.id })
      }),
    )
    return deletedTeam
  }
  const deletedTeam = await Team.query(trx).patchAndFetchById(teamId, {
    deleted: false,
    objectId: null,
    objectType: null,
  })
  logger.info(`>>> associated team with id ${teamId} deleted`)
  logger.info(`>>> corresponding team's object cleaned`)

  const teamMembers = await TeamMember.query(trx).where({
    teamId,
    deleted: false,
  })

  logger.info(`>>> fetching team members of team with id ${teamId}`)
  await Promise.all(
    map(teamMembers, async teamMember => {
      logger.info(`>>> team member with id ${teamMember.id} deleted`)
      return TeamMember.query(trx)
        .patch({ deleted: true })
        .where({ id: teamMember.id })
    }),
  )
  return deletedTeam
}

module.exports = {
  createTeam,
  getEntityTeams,
  getEntityTeam,
  deleteTeam,
}
