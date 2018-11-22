const path = require('path')
// const uuid = require('uuid')

const pathToComponent = path.resolve(__dirname, '..', 'index')

process.env.NODE_CONFIG_DIR = path.resolve(__dirname, 'config')
process.env.NODE_CONFIG = `{"pubsweet":{"components":["${pathToComponent}"]}}`

// These tests are not testing authorization, authsome
// returns true for everything
// jest.mock('../../../config/authsome.js', () => () => true)

// const { model: Book } = require('../book')
const Book = require('../book')
const { dbCleaner } = require('pubsweet-server/test')

describe('Book', () => {
  beforeEach(async () => {
    await dbCleaner()
  })

  it('can add books', async () => {
    console.log('hey')
    // await new Book({ title: 'new' }).save()
    await new Book({ license: 'mine' }).save()
  })
})
