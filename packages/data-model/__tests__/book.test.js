const path = require('path')
const uuid = require('uuid/v4')

const pathToComponent = path.resolve(__dirname, '..', 'src', 'book', 'index')

process.env.NODE_CONFIG_DIR = path.resolve(__dirname, 'config')
process.env.NODE_CONFIG = `{"pubsweet":{"components":["${pathToComponent}"]}}`

const { model: Book } = require('../src/book')
const { dbCleaner } = require('pubsweet-server/test')

describe('Book', () => {
  beforeEach(async () => {
    await dbCleaner()
  })

  it('can add books', async () => {
    const divisionId = uuid()
    const publicationDate = new Date()

    // await new Book({ title: 'new' }).save()

    await new Book({
      copyrightStatement: 'lkfjslkjf',
      copyrightYear: 1999,
      copyrightHolder: 'djlsfjdsjlf',
      divisions: [divisionId],
      edition: 1,
      license: 'mine it is',
      publicationDate,
    }).save()
  })
})
