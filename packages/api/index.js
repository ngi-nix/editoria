const activity = require('./activity')
const book = require('./book')
const bookComponent = require('./bookComponent')
const bookComponentState = require('./bookComponentState')
const bookComponentTranslation = require('./bookComponentTranslation')
const bookTranslation = require('./bookTranslation')
const collection = require('./collection')
const collectionTranslation = require('./collectionTranslation')
const contributor = require('./contributor')
const division = require('./division')
const file = require('./file')
const fileTranslation = require('./fileTranslation')
const language = require('./language')
const lock = require('./lock')
const sponsor = require('./sponsor')
const merge = require('lodash/merge')

module.exports = {
  typeDefs: [
    activity.typeDefs,
    book.typeDefs,
    bookComponent.typeDefs,
    bookComponentState.typeDefs,
    bookComponentTranslation.typeDefs,
    bookTranslation.typeDefs,
    collection.typeDefs,
    collectionTranslation.typeDefs,
    contributor.typeDefs,
    division.typeDefs,
    file.typeDefs,
    fileTranslation.typeDefs,
    language.typeDefs,
    lock.typeDefs,
    sponsor.typeDefs,
  ].join(' '),
  resolvers: merge(
    {},
    activity.resolvers,
    book.resolvers,
    bookComponent.resolvers,
    bookComponentState.resolvers,
    bookComponentTranslation.resolvers,
    bookTranslation.resolvers,
    collection.resolvers,
    collectionTranslation.resolvers,
    contributor.resolvers,
    division.resolvers,
    file.resolvers,
    fileTranslation.resolvers,
    language.resolvers,
    lock.resolvers,
    sponsor.resolvers,
  ),
  context: {
    // TODO: Models should be placed here
    // models: {
    // book: book.model,
    // bookComponent: bookComponent.model,
    // collection: collection.model,
    // file: file.model,
    // lock: lock.model,
    // },
    // TODO: loaders should be implemented
    // loaders: loaders()
  },
}
