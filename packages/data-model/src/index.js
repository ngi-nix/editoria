const book = require('./book')
const bookCollection = require('./bookCollection')
const bookCollectionTranslation = require('./bookCollectionTranslation')
const bookComponent = require('./bookComponent')
const bookComponentState = require('./bookComponentState')
const bookComponentTranslation = require('./bookComponentTranslation')
const bookTranslation = require('./bookTranslation')
const file = require('./file')
const fileTranslation = require('./fileTranslation')
const template = require('./template')
const customTag = require('./customTag')
const division = require('./division')
const team = require('./team')
const user = require('./user')
const lock = require('./lock')
const { models } = require('./dataloader')

const loader = models.reduce((r, c) => Object.assign(r, c), {})

module.exports = {
  book,
  customTag,
  team,
  user,
  bookCollection,
  bookCollectionTranslation,
  bookComponent,
  bookComponentState,
  bookComponentTranslation,
  bookTranslation,
  division,
  file,
  fileTranslation,
  lock,
  loader,
  template,
  models: {
    Book: book.model,
    BookCollection: bookCollection.model,
    BookCollectionTranslation: bookCollectionTranslation.model,
    BookComponent: bookComponent.model,
    BookComponentState: bookComponentState.model,
    BookComponentTranslation: bookComponentTranslation.model,
    BookTranslation: bookTranslation.model,
    CustomTag: customTag.model,
    Division: division.model,
    File: file.model,
    FileTranslation: fileTranslation.model,
    Team: team.model,
    Template: template.model,
    User: user.model,
    Lock: lock.model,
    loader,
  },
}
