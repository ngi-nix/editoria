const registerComponents = require('./helpers/registerComponents')
registerComponents(['book', 'bookCollection'])

const uuid = require('uuid/v4')
const { dbCleaner } = require('pubsweet-server/test')
const { Book, BookCollection } = require('../src').models

describe('Book', () => {
  beforeEach(async () => {
    await dbCleaner()
  })

  it('can add books', async () => {
    const divisionId = uuid()
    const publicationDate = new Date()

    let collectionId
    await new BookCollection().save().then(res => (collectionId = res.id))

    // const book = await new Book({
    await new Book({
      // collectionId: uuid(),
      collectionId,
      copyrightStatement: 'lkfjslkjf',
      copyrightYear: 1999,
      copyrightHolder: 'djlsfjdsjlf',
      divisions: [divisionId],
      edition: 1,
      license: 'mine it is',
      publicationDate,
    }).save()

    // await Book.all().then(res => console.log(res))
    // await BookCollection.all().then(res => console.log(res))
    // await book.getCollection().then(res => console.log(res))
  })
})
