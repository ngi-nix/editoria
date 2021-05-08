const { pubsubManager, logger } = require('@coko/server')
const map = require('lodash/map')

const {
  BOOK_CREATED,
  BOOK_DELETED,
  BOOK_RENAMED,
  BOOK_ARCHIVED,
  BOOK_METADATA_UPDATED,
  BOOK_RUNNING_HEADERS_UPDATED,
} = require('./consts')
const { BookTranslation } = require('../../data-model/src').models

const {
  useCaseGetPreviewerLink,
  useCaseGetBook,
  useCaseCreateBook,
  useCaseRenameBook,
  useCaseDeleteBook,
  useCaseArchiveBook,
  useCaseUpdateMetadata,
  useCaseExportBook,
  useCaseUpdateRunningHeader,
  useCaseGetEntityTeam,
} = require('../useCases')

const getBook = async (_, { id }, ctx, info) => {
  try {
    logger.info('book resolver: executing getBook use case')
    return useCaseGetBook(id)
  } catch (e) {
    throw new Error(e)
  }
}

const createBook = async (_, { input }, ctx) => {
  try {
    logger.info('book resolver: executing createBook use case')

    const { collectionId, title } = input
    const pubsub = await pubsubManager.getPubsub()

    logger.info('book resolver: checking permissions for book creation')
    await ctx.helpers.can(ctx.user, 'create', 'Book')

    const newBook = await useCaseCreateBook(collectionId, title)

    logger.info('book resolver: broadcasting new book to clients')

    pubsub.publish(BOOK_CREATED, { bookCreated: newBook })

    return newBook
  } catch (e) {
    throw new Error(e)
  }
}

const renameBook = async (_, { id, title }, ctx) => {
  try {
    logger.info('book resolver: executing renameBook use case')

    const pubsub = await pubsubManager.getPubsub()
    const book = await useCaseGetBook(id)

    logger.info('book resolver: checking permissions for book renaming')
    await ctx.helpers.can(ctx.user, 'update', book)

    const renamedBook = await useCaseRenameBook(id, title)

    logger.info('book resolver: broadcasting renamed book to clients')

    pubsub.publish(BOOK_RENAMED, {
      bookRenamed: renamedBook,
    })

    return renamedBook
  } catch (e) {
    throw new Error(e)
  }
}

const deleteBook = async (_, args, ctx) => {
  try {
    logger.info('book resolver: executing deleteBook use case')
    const pubsub = await pubsubManager.getPubsub()
    const book = await useCaseGetBook(args.id)

    logger.info('book resolver: checking permissions for book deletion')
    await ctx.helpers.can(ctx.user, 'update', book)

    const deletedBook = await useCaseDeleteBook(args.id)

    logger.info('book resolver: broadcasting deleted book to clients')

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
    logger.info('book resolver: executing archiveBook use case')
    const pubsub = await pubsubManager.getPubsub()

    const archivedBook = await useCaseArchiveBook(id, archive)

    logger.info('book resolver: broadcasting archived book to clients')

    pubsub.publish(BOOK_ARCHIVED, {
      bookArchived: archivedBook,
    })
    return archivedBook
  } catch (e) {
    throw new Error(e)
  }
}

const updateMetadata = async (_, { input }, ctx) => {
  try {
    logger.info('book resolver: executing updateMetadata use case')
    const pubsub = await pubsubManager.getPubsub()

    const updatedBook = await useCaseUpdateMetadata(input)

    logger.info('book resolver: broadcasting updated book to clients')

    pubsub.publish(BOOK_METADATA_UPDATED, {
      bookMetadataUpdated: updatedBook,
    })
    return updatedBook
  } catch (e) {
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
    logger.info('book resolver: executing exportBook use case')
    return useCaseExportBook(
      bookId,
      mode,
      templateId,
      previewer,
      fileExtension,
      icmlNotes,
    )
  } catch (e) {
    throw new Error(e)
  }
}

const updateRunningHeaders = async (_, { input, bookId }, ctx) => {
  try {
    logger.info('book resolver: executing updateRunningHeaders use case')
    const pubsub = await pubsubManager.getPubsub()
    const updatedBook = await useCaseUpdateRunningHeader(input, bookId)

    logger.info('book resolver: broadcasting updated book to clients')

    pubsub.publish(BOOK_RUNNING_HEADERS_UPDATED, {
      bookRunningHeadersUpdated: updatedBook,
    })

    return updatedBook
  } catch (e) {
    throw new Error(e)
  }
}

const getPagedPreviewerLink = async (_, { hash }, ctx) => {
  try {
    logger.info('book resolver: executing getPreviewerLink use case')
    return useCaseGetPreviewerLink(hash)
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  Query: {
    getBook,
    getPagedPreviewerLink,
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
      const authorsTeam = await useCaseGetEntityTeam(
        book.id,
        'book',
        'author',
        true,
      )
      let authors = []
      if (authorsTeam && authorsTeam.members.length > 0) {
        authors = authorsTeam.members
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
      const productionEditorsTeam = await useCaseGetEntityTeam(
        book.id,
        'book',
        'productionEditor',
        true,
      )

      let productionEditors = []

      if (productionEditorsTeam && productionEditorsTeam.members.length > 0) {
        productionEditors = map(productionEditorsTeam.members, teamMember => {
          const { givenName, surname } = teamMember
          return `${givenName} ${surname}`
        })
      }

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
