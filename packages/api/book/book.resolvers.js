const pubsweetServer = require('pubsweet-server')
const forEach = require('lodash/forEach')
const keys = require('lodash/keys')
const map = require('lodash/map')
const filter = require('lodash/filter')
const config = require('config')
const logger = require('@pubsweet/logger')

const { pubsubManager } = pubsweetServer

const {
  BOOK_CREATED,
  BOOK_DELETED,
  BOOK_RENAMED,
  BOOK_ARCHIVED,
} = require('./consts')
const {
  Book,
  BookTranslation,
  BookComponent,
  Division,
} = require('editoria-data-model/src').models

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
    const pubsub = await pubsubManager.getPubsub()
    const book = await new Book({
      collectionId,
    }).save()
    logger.info(`New Book created with id ${book.id}`)
    await new BookTranslation({
      bookId: book.id,
      title,
      languageIso: 'en',
    }).save()
    logger.info(
      `New Book Translation (title: ${title})created for the book ${book.id}`,
    )
    pubsub.publish(BOOK_CREATED, { bookCreated: book })

    const teamTypes = keys(config.authsome.teams)
    await Promise.all(
      forEach(teamTypes, async teamType => {
        await ctx.connectors.Team.create(
          {
            name: config.authsome.teams[teamType].name,
            object: { objectId: book.id, objectType: 'book' },
            teamType,
            deleted: false,
            global: false,
          },
          ctx,
        )
        logger.info(`Team of type ${teamType} created for the book ${book.id}`)
      }),
    )
    return book
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const renameBook = async (_, { id, title }, ctx) => {
  try {
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
        forEach(associatedBookComponents, async bookComponent => {
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
      forEach(associatedDivisions, async division => {
        const updatedDivision = await Division.query().patchAndFetchById(
          division.id,
          {
            bookComponents: [],
            deleted: true,
          },
        )
        logger.info(`Associated division with id ${division.id} deleted`)
        logger.info(
          `Corresponding division's book components [${
            updatedDivision.bookComponents
          }] cleaned`,
        )
      }),
    )

    const allTeams = await ctx.connectors.Team.fetchAll(ctx)
    const associatedTeams = filter(allTeams, team => {
      if (team.object) {
        return team.object.id === args.id
      }
      return false
    })

    if (associatedTeams.length > 0) {
      await Promise.all(
        forEach(associatedTeams, async team => {
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
        forEach(associatedBookComponents, async bookComponent => {
          await BookComponent.query().patchAndFetchById(bookComponent.id, {
            archived: archive,
          })
          logger.info(
            `Associated book component with id ${bookComponent.id} archived`,
          )
        }),
      )
    }

    pubsub.publish(BOOK_DELETED, {
      bookArchived: archivedBook,
    })
    return archivedBook
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
    async productionEditors(book, _, ctx) {
      const allTeams = await ctx.connectors.Team.fetchAll(ctx)
      const productionEditorTeam = filter(allTeams, team => {
        if (team.object) {
          return (
            team.object.objectId === book.id &&
            team.teamType === 'productionEditor'
          )
        }
        return false
      })
      const productionEditors = await Promise.all(
        map(productionEditorTeam[0].members, async id => {
          const user = await ctx.connectors.User.fetchOne(id, ctx)
          return user.username
        }),
      )
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
  },
}
