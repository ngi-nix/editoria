const pubsweetServer = require('pubsweet-server')
const keys = require('lodash/keys')
const map = require('lodash/map')
const assign = require('lodash/assign')
const omitBy = require('lodash/omitBy')
const isNil = require('lodash/isNil')
const filter = require('lodash/filter')
const config = require('config')
const logger = require('@pubsweet/logger')
const exporter = require('./utils/exporter')

const { pubsubManager } = pubsweetServer

const {
  BOOK_CREATED,
  BOOK_DELETED,
  BOOK_RENAMED,
  BOOK_ARCHIVED,
  BOOK_METADATA_UPDATED,
  BOOK_RUNNING_HEADERS_UPDATED,
} = require('./consts')
const {
  Book,
  BookTranslation,
  BookComponentState,
  BookComponent,
  Division,
  ApplicationParameter,
  BookComponentTranslation,
} = require('../../data-model/src').models

const eager = '[members.[user, alias]]'

const getBook = async (_, { id }, ctx, info) => {
  const book = await Book.findById(id)

  if (!book) {
    throw new Error(`Book with id: ${id} does not exist`)
  }

  return book
}

const createBook = async (_, { input }, ctx) => {
  const { collectionId, title } = input
  try {
    await ctx.helpers.can(ctx.user, 'create', 'Book')

    const pubsub = await pubsubManager.getPubsub()
    const book = await Book.query().insert({
      collectionId,
    })
    logger.info(`New Book created with id ${book.id}`)
    await BookTranslation.query().insert({
      bookId: book.id,
      title,
      languageIso: 'en',
    })
    logger.info(
      `New Book Translation (title: ${title})created for the book ${book.id}`,
    )

    const roles = keys(config.authsome.teams)
    await Promise.all(
      map(roles, async role => {
        const newTeam = await ctx.connectors.Team.create(
          {
            name: config.authsome.teams[role].name,
            objectId: book.id,
            objectType: 'book',
            role,
            deleted: false,
            global: false,
          },
          ctx,
          {
            relate: true,
            unrelate: true,
          },
        )
        logger.info(`Team of type ${role} created for the book ${book.id}`)

        // const user = await ctx.connectors.User.fetchOne(ctx.user, ctx)
        // if (!user.admin && role === 'productionEditor') {
        //   const userMember = pick(user, [
        //     'id',
        //     'email',
        //     'username',
        //     'admin',
        //     'type',
        //   ])
        //   const member = { members: [{ user: [userMember] }] }
        //   await ctx.connectors.Team.update(newTeam.id, member, ctx, {
        //     unrelate: false,
        //     eager: 'members.user.teams',
        //   })
        // }
      }),
    )
    // CREATE TABLE OF CONTENTS IN THE FRONT MATTER
    const workflowConfig = await ApplicationParameter.query().where({
      context: 'bookBuilder',
      area: 'stages',
    })

    const { config: workflowStages } = workflowConfig[0]

    let bookComponentWorkflowStages

    const division = await Division.query()
      .where({ bookId: book.id, label: 'Frontmatter' })
      .andWhere({ deleted: false })
    logger.info(
      `Division which will hold the book found with id ${division[0].id}`,
    )
    const newBookComponent = {
      bookId: book.id,
      componentType: 'toc',
      divisionId: division[0].id,
      pagination: {
        left: false,
        right: true,
      },
      archived: false,
      deleted: false,
    }
    const createdBookComponent = await BookComponent.query().insert(
      newBookComponent,
    )

    logger.info(`New book component created with id ${createdBookComponent.id}`)
    const translation = await BookComponentTranslation.query().insert({
      bookComponentId: createdBookComponent.id,
      languageIso: 'en',
      title: 'Table of Contents',
    })

    logger.info(
      `New book component translation created with id ${translation.id}`,
    )
    const newBookComponents = division[0].bookComponents

    newBookComponents.push(createdBookComponent.id)

    const updatedDivision = await Division.query().patchAndFetchById(
      division[0].id,
      { bookComponents: newBookComponents },
    )

    logger.info(
      `Book component pushed to the array of division's book components [${updatedDivision.bookComponents}]`,
    )
    if (workflowStages) {
      bookComponentWorkflowStages = {
        workflowStages: map(workflowStages, stage => ({
          type: stage.type,
          label: stage.title,
          value: -1,
        })),
      }
    }

    await BookComponentState.query().insert(
      assign(
        {},
        {
          bookComponentId: createdBookComponent.id,
          trackChangesEnabled: false,
          uploading: false,
          includeInToc: false,
        },
        bookComponentWorkflowStages,
      ),
    )
    /// END
    pubsub.publish(BOOK_CREATED, { bookCreated: book })
    return book
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const renameBook = async (_, { id, title }, ctx) => {
  try {
    await ctx.helpers.can(ctx.user, 'update', await Book.findById(id))

    const pubsub = await pubsubManager.getPubsub()
    const bookTranslation = await BookTranslation.query()
      .where('bookId', id)
      .andWhere('languageIso', 'en')
    const updatedTranslation = await BookTranslation.query().patchAndFetchById(
      bookTranslation[0].id,
      { title },
    )
    logger.info(`Book's (${id}) title updated to ${updatedTranslation.title}`)
    const book = await Book.findById(id)

    pubsub.publish(BOOK_RENAMED, {
      bookRenamed: {
        id: book.id,
        collectionId: book.collectionId,
        title,
      },
    })

    return book
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const deleteBook = async (_, args, ctx) => {
  try {
    const pubsub = await pubsubManager.getPubsub()
    await ctx.helpers.can(ctx.user, 'update', await Book.findById(args.id))

    const deletedBook = await Book.query().patchAndFetchById(args.id, {
      deleted: true,
    })
    logger.info(`Book with id ${deletedBook.id} deleted`)

    const associatedBookComponents = await BookComponent.query().where(
      'bookId',
      args.id,
    )

    if (associatedBookComponents.length > 0) {
      await Promise.all(
        map(associatedBookComponents, async bookComponent => {
          await BookComponent.query().patchAndFetchById(bookComponent.id, {
            deleted: true,
          })
          logger.info(
            `Associated book component with id ${bookComponent.id} deleted`,
          )
        }),
      )
    }

    const associatedDivisions = await Division.query().where(
      'bookId',
      deletedBook.id,
    )
    await Promise.all(
      map(associatedDivisions, async division => {
        const updatedDivision = await Division.query().patchAndFetchById(
          division.id,
          {
            bookComponents: [],
            deleted: true,
          },
        )
        logger.info(`Associated division with id ${division.id} deleted`)
        logger.info(
          `Corresponding division's book components [${updatedDivision.bookComponents}] cleaned`,
        )
      }),
    )

    const allTeams = await ctx.connectors.Team.fetchAll({}, ctx, { eager })
    const associatedTeams = filter(allTeams, team => {
      if (team.object) {
        return team.object.id === args.id
      }
      return false
    })

    if (associatedTeams.length > 0) {
      await Promise.all(
        map(associatedTeams, async team => {
          const updatedTeam = await ctx.connectors.Team.update(
            team.id,
            { deleted: true, object: {} },
            ctx,
          )
          logger.info(`Associated team with id ${team.id} deleted`)
          logger.info(
            `Corresponding team's object {${updatedTeam.object}} cleaned`,
          )
        }),
      )
    }

    pubsub.publish(BOOK_DELETED, {
      bookDeleted: deletedBook,
    })
    return deletedBook
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const archiveBook = async (_, { id, archive }, ctx) => {
  try {
    const pubsub = await pubsubManager.getPubsub()
    const archivedBook = await Book.query().patchAndFetchById(id, {
      archived: archive,
    })
    logger.info(`Book with id ${archivedBook.id} archived`)

    const associatedBookComponents = await BookComponent.query().where(
      'bookId',
      id,
    )

    if (associatedBookComponents.length > 0) {
      await Promise.all(
        map(associatedBookComponents, async bookComponent => {
          await BookComponent.query().patchAndFetchById(bookComponent.id, {
            archived: archive,
          })
          logger.info(
            `Associated book component with id ${bookComponent.id} archived`,
          )
        }),
      )
    }

    pubsub.publish(BOOK_ARCHIVED, {
      bookArchived: archivedBook,
    })
    return archivedBook
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const updateMetadata = async (_, { input }, ctx) => {
  const clean = omitBy(input, isNil)

  const { id, ...rest } = clean
  try {
    const pubsub = await pubsubManager.getPubsub()
    const updatedBook = await Book.query().patchAndFetchById(id, {
      ...rest,
    })
    logger.info(`Book with id ${updatedBook.id} has new metadata`)

    pubsub.publish(BOOK_METADATA_UPDATED, {
      bookMetadataUpdated: updatedBook,
    })
    return updatedBook
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const exportBook = async (_, { input }, ctx) => {
  const {
    bookId,
    mode,
    previewer,
    templateId,
    fileExtension,
    icmlNotes,
  } = input
  try {
    return exporter(
      bookId,
      mode,
      templateId,
      previewer,
      fileExtension,
      icmlNotes,
      ctx,
    )
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const updateRunningHeaders = async (_, { input, bookId }, ctx) => {
  try {
    const pubsub = await pubsubManager.getPubsub()

    await Promise.all(
      map(input, async bookComponent => {
        const { id } = bookComponent
        const bookComponentState = await BookComponentState.query().where(
          'bookComponentId',
          id,
        )

        return BookComponentState.query().patchAndFetchById(
          bookComponentState[0].id,
          {
            runningHeadersRight: bookComponent.runningHeadersRight,
            runningHeadersLeft: bookComponent.runningHeadersLeft,
          },
        )
      }),
    )
    const updatedBook = await Book.findById(bookId)
    pubsub.publish(BOOK_RUNNING_HEADERS_UPDATED, {
      bookRunningHeadersUpdated: updatedBook,
    })

    return updatedBook
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

module.exports = {
  Query: {
    getBook,
  },
  Mutation: {
    archiveBook,
    createBook,
    renameBook,
    deleteBook,
    exportBook,
    updateMetadata,
    updateRunningHeaders,
  },
  Book: {
    async title(book, _, ctx) {
      const bookTranslation = await BookTranslation.query()
        .where('bookId', book.id)
        .andWhere('languageIso', 'en')

      return bookTranslation[0].title
    },
    divisions(book, _, ctx) {
      return book.divisions
    },
    archived(book, _, ctx) {
      return book.archived
    },
    async authors(book, args, ctx, info) {
      const teams = await ctx.connectors.Team.fetchAll(
        { objectId: book.id, role: 'author' },
        ctx,
        { eager },
      )
      let authors = []
      if (teams[0] && teams[0].members.length > 0) {
        authors = map(teams[0].members, teamMember => teamMember.user)
      }
      return authors
    },
    async isPublished(book, args, ctx, info) {
      let isPublished = false
      if (book.publicationDate) {
        const date = book.publicationDate
        const inTimestamp = new Date(date).getTime()
        const nowDate = new Date()
        const nowTimestamp = nowDate.getTime()
        if (inTimestamp <= nowTimestamp) {
          isPublished = true
        } else {
          isPublished = false
        }
      }
      return isPublished
    },
    async productionEditors(book, _, ctx) {
      const productionEditorTeams = await ctx.connectors.Team.fetchAll(
        { objectId: book.id, role: 'productionEditor' },
        ctx,
        { eager },
      )
      // const productionEditorTeam = filter(allTeams, team => {
      //   if (team.objectId) {
      //     return team.objectId === book.id && team.role === 'productionEditor'
      //   }
      //   return false
      // })
      let productionEditors = []
      if (
        productionEditorTeams[0] &&
        productionEditorTeams[0].members.length > 0
      ) {
        productionEditors = map(
          productionEditorTeams[0].members,
          teamMember => {
            const { user } = teamMember
            return `${user.givenName} ${user.surname}`
          },
        )
      }
      // return authors
      // const productionEditors = await Promise.all(
      //   map(productionEditorTeam[0].members, async member => {
      //     const user = await ctx.connectors.User.fetchOne(member.user.id, ctx)
      //     return `${user.givenName} ${user.surname}`
      //   }),
      // )
      return productionEditors
    },
  },
  Subscription: {
    bookCreated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_CREATED)
      },
    },
    bookArchived: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_ARCHIVED)
      },
    },
    bookDeleted: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_DELETED)
      },
    },
    bookRenamed: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_RENAMED)
      },
    },
    bookMetadataUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_METADATA_UPDATED)
      },
    },
    bookRunningHeadersUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_RUNNING_HEADERS_UPDATED)
      },
    },
  },
}
