const { useTransaction, logger } = require('@coko/server')
const keys = require('lodash/keys')
const map = require('lodash/map')
const assign = require('lodash/assign')
const omitBy = require('lodash/omitBy')
const isNil = require('lodash/isNil')
const config = require('config')
const exporter = require('./utils/exporter')

const {
  Book,
  BookTranslation,
  BookComponentState,
  BookComponent,
  Division,
  BookComponentTranslation,
} = require('../../data-model/src').models

const { getApplicationParameters } = require('./applicationParameters')
const { createDivision } = require('./division')
const { createTeam, getEntityTeams, deleteTeam } = require('./team')

const getBook = async id => {
  try {
    logger.info(`>>> fetching book with id ${id}`)

    const book = await Book.findById(id)

    if (!book) {
      throw new Error(`book with id: ${id} does not exist`)
    }

    return book
  } catch (e) {
    throw new Error(e)
  }
}

const getBooks = async (collectionId, archived) => {
  try {
    logger.info(`>>> fetching books for collection with id ${collectionId}`)
    if (!archived) {
      return Book.query().where({
        collectionId,
        deleted: false,
        archived: false,
      })
    }

    return Book.query().where({
      collectionId,
      deleted: false,
    })
  } catch (e) {
    throw new Error(e)
  }
}

const createBook = async (collectionId, title) => {
  try {
    return useTransaction(async trx => {
      const options = { trx }

      const newBook = await Book.query(trx).insert({
        collectionId,
      })

      const { id: bookId } = newBook

      logger.info(`>>> new book created with id ${bookId}`)

      await BookTranslation.query(trx).insert({
        bookId,
        title,
        languageIso: 'en',
      })

      logger.info(
        `>>> new book translation (title: ${title}) created for the book with id ${bookId}`,
      )

      const { config: divisions } = await getApplicationParameters(
        'bookBuilder',
        'divisions',
        options,
      )

      let createdDivisionIds
      let divisionData

      if (divisions.length === 0) {
        divisionData = {
          bookId,
          bookComponents: [],
          label: 'Body',
        }
        const division = await createDivision(divisionData, options)
        createdDivisionIds = [division.id]
      } else {
        const createdDivisions = await Promise.all(
          divisions.map(async division => {
            divisionData = {
              bookId,
              bookComponents: [],
              label: division.name,
            }
            return createDivision(divisionData, options)
          }),
        )

        createdDivisionIds = createdDivisions.map(d => d.id)
      }

      await Book.query(trx)
        .patch({ divisions: createdDivisionIds })
        .where({ id: bookId })

      logger.info(`>>> book with id ${bookId} patched with the new divisions`)

      logger.info(`>>> creating teams for book with id ${bookId}`)

      const roles = keys(config.authsome.teams)
      await Promise.all(
        map(roles, async role =>
          createTeam(
            config.authsome.teams[role].name,
            bookId,
            'book',
            role,
            false,
            false,
            { trx },
          ),
        ),
      )

      logger.info(`>>> creating TOC component for the book with id ${bookId}`)

      const workflowConfig = await getApplicationParameters(
        'bookBuilder',
        'stages',
      )

      const { config: workflowStages } = workflowConfig

      let bookComponentWorkflowStages

      const division = await Division.query(trx)
        .where({ bookId, label: 'Frontmatter' })
        .andWhere({ deleted: false })

      logger.info(
        `>>> division which will hold the TOC found with id ${division[0].id}`,
      )

      const newBookComponent = {
        bookId,
        componentType: 'toc',
        divisionId: division[0].id,
        pagination: {
          left: false,
          right: true,
        },
        archived: false,
        deleted: false,
      }

      const createdBookComponent = await BookComponent.query(trx).insert(
        newBookComponent,
      )

      logger.info(
        `>>> new book component (TOC) created with id ${createdBookComponent.id}`,
      )

      const translation = await BookComponentTranslation.query(trx).insert({
        bookComponentId: createdBookComponent.id,
        languageIso: 'en',
        title: 'Table of Contents',
      })

      logger.info(
        `>>> new book component translation for TOC created with id ${translation.id}`,
      )

      const newBookComponents = division[0].bookComponents

      newBookComponents.push(createdBookComponent.id)

      const updatedDivision = await Division.query(
        trx,
      ).patchAndFetchById(division[0].id, { bookComponents: newBookComponents })

      logger.info(
        `>>> book component TOC pushed to the array of division's book components [${updatedDivision.bookComponents}]`,
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

      await BookComponentState.query(trx).insert(
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

      return newBook
    })
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const renameBook = async (bookId, title) => {
  try {
    return useTransaction(async trx => {
      const bookTranslation = await BookTranslation.query(trx)
        .where('bookId', bookId)
        .andWhere('languageIso', 'en')

      await BookTranslation.query(trx)
        .patch({ title })
        .where({ id: bookTranslation[0].id })

      logger.info(`>>> title updated for book with id ${bookId}`)

      return Book.query(trx).where({ id: bookId, deleted: false })
    })
  } catch (e) {
    throw new Error(e)
  }
}

const deleteBook = async bookId => {
  try {
    return useTransaction(async trx => {
      const deletedBook = await Book.query(trx).patchAndFetchById(bookId, {
        deleted: true,
      })

      logger.info(`>>> book with id ${bookId} deleted`)

      const associatedBookComponents = await BookComponent.query(trx).where(
        'bookId',
        bookId,
      )

      if (associatedBookComponents.length > 0) {
        await Promise.all(
          map(associatedBookComponents, async bookComponent => {
            await BookComponent.query(trx).patchAndFetchById(bookComponent.id, {
              deleted: true,
            })
            logger.info(
              `>>> associated book component with id ${bookComponent.id} deleted`,
            )
          }),
        )
      }

      const associatedDivisions = await Division.query(trx).where(
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
          logger.info(`>>> associated division with id ${division.id} deleted`)
          logger.info(
            `>>> corresponding division's book components [${updatedDivision.bookComponents}] cleaned`,
          )
        }),
      )

      const associatedTeams = await getEntityTeams(bookId, 'book', false, {
        trx,
      })

      if (associatedTeams.length > 0) {
        await Promise.all(
          map(associatedTeams, async team => deleteTeam(team.id, { trx })),
        )
      }

      return deletedBook
    })
  } catch (e) {
    throw new Error(e)
  }
}

const archiveBook = async (bookId, archive) => {
  try {
    return useTransaction(async trx => {
      const archivedBook = await Book.query(trx).patchAndFetchById(bookId, {
        archived: archive,
      })
      logger.info(`>>> book with id ${archivedBook.id} archived`)

      const associatedBookComponents = await BookComponent.query(trx).where(
        'bookId',
        bookId,
      )

      if (associatedBookComponents.length > 0) {
        await Promise.all(
          map(associatedBookComponents, async bookComponent => {
            await BookComponent.query(trx).patchAndFetchById(bookComponent.id, {
              archived: archive,
            })
            logger.info(
              `>>> associated book component with id ${bookComponent.id} archived`,
            )
          }),
        )
      }

      return archivedBook
    })
  } catch (e) {
    throw new Error(e)
  }
}

const updateMetadata = async metadata => {
  try {
    return useTransaction(async trx => {
      const clean = omitBy(metadata, isNil)

      const { id, ...rest } = clean

      const updatedBook = await Book.query(trx).patchAndFetchById(id, {
        ...rest,
      })

      logger.info(`>>> book with id ${updatedBook.id} has new metadata`)

      return updatedBook
    })
  } catch (e) {
    throw new Error(e)
  }
}

const exportBook = async (
  bookId,
  mode,
  templateId,
  previewer,
  fileExtension,
  icmlNotes,
) => {
  try {
    return exporter(
      bookId,
      mode,
      templateId,
      previewer,
      fileExtension,
      icmlNotes,
    )
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const updateRunningHeaders = async (bookComponents, bookId) => {
  try {
    return useTransaction(async trx => {
      await Promise.all(
        map(bookComponents, async bookComponent => {
          const { id } = bookComponent
          const bookComponentState = await BookComponentState.query(trx).where(
            'bookComponentId',
            id,
          )

          return BookComponentState.query(trx).patchAndFetchById(
            bookComponentState[0].id,
            {
              runningHeadersRight: bookComponent.runningHeadersRight,
              runningHeadersLeft: bookComponent.runningHeadersLeft,
            },
          )
        }),
      )

      logger.info(`>>> running headers updated for book with id ${bookId}`)

      const book = await Book.query(trx).where({ id: bookId, deleted: false })

      return book[0]
    })
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  getBook,
  getBooks,
  archiveBook,
  createBook,
  renameBook,
  deleteBook,
  exportBook,
  updateMetadata,
  updateRunningHeaders,
}
