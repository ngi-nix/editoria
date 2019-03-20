const book = require('./book')
const bookCollection = require('./bookCollection')
const bookCollectionTranslation = require('./bookCollectionTranslation')
const bookComponent = require('./bookComponent')
const bookComponentState = require('./bookComponentState')
const bookComponentTranslation = require('./bookComponentTranslation')
const bookTranslation = require('./bookTranslation')
const division = require('./division')
const team = require('./team')
const user = require('./user')
const lock = require('./lock')
const { models } = require('./dataloader')

const loader = models.reduce((r, c) => Object.assign(r, c), {})

module.exports = {
  book,
  team,
  user,
  bookCollection,
  bookCollectionTranslation,
  bookComponent,
  bookComponentState,
  bookComponentTranslation,
  bookTranslation,
  division,
  lock,
  loader,
  models: {
    Book: book.model,
    BookCollection: bookCollection.model,
    BookCollectionTranslation: bookCollectionTranslation.model,
    BookComponent: bookComponent.model,
    BookComponentState: bookComponentState.model,
    BookComponentTranslation: bookComponentTranslation.model,
    BookTranslation: bookTranslation.model,
    Division: division.model,
    Team: team.model,
    User: user.model,
    Lock: lock.model,
    loader,
  },
}
