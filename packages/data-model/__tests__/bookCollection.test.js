const path = require('path')
// const uuid = require('uuid/v4')

const pathToComponent = path.resolve(
  __dirname,
  '..',
  'src',
  'bookCollection',
  'index',
)

process.env.NODE_CONFIG_DIR = path.resolve(__dirname, 'config')
process.env.NODE_CONFIG = `{"pubsweet":{"components":["${pathToComponent}"]}}`

const { model: BookCollection } = require('../src/bookCollection')
const { dbCleaner } = require('pubsweet-server/test')

describe('BookCollection', () => {
  beforeEach(async () => {
    await dbCleaner()
  })

  it('can add book collections', async () => {
    // await new BookCollection().save()
  })
})
