const uuid = require('uuid/v4')
const { dbCleaner } = require('pubsweet-server/test')
const config = require('config')
// const set = require('lodash/set')
const unset = require('lodash/unset')

const { Book, BookCollection, Division } = require('../src').models

describe('Book', () => {
  beforeEach(async () => {
    await dbCleaner()
  })

  it('can add books', async () => {
    const divisionId = uuid()
    const publicationDate = new Date().toString()

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

  it('creates divisions on book creation based on the config', async () => {
    const collection = await new BookCollection().save()
    const book = await new Book({ collectionId: collection.id }).save()

    const divisions = await Division.query().where('bookId', book.id)
    expect(divisions).toHaveLength(3)
    expect(book.divisions).toHaveLength(3)

    const positions = {
      front: 0,
      body: 1,
      back: 2,
    }

    divisions.forEach(division => {
      expect(division.bookId).toBe(book.id)

      const correctPosition = positions[division.label]
      const actualPosition = book.divisions.indexOf(division.id)
      expect(actualPosition).toBe(correctPosition)
    })
  })

  it('creates a default division on book creation if no config is found', async () => {
    unset(config, 'bookBuilder')
    const collection = await new BookCollection().save()
    const book = await new Book({ collectionId: collection.id }).save()
    const divisions = await Division.query().where('bookId', book.id)

    expect(divisions).toHaveLength(1)
    expect(book.divisions).toHaveLength(1)

    const division = divisions[0]
    expect(division.id).toBe(book.divisions[0])
    expect(division.label).toBe('body')
  })
})
