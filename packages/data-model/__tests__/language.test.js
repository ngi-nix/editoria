const registerComponents = require('./helpers/registerComponents')
registerComponents(['language'])

const { dbCleaner } = require('pubsweet-server/test')
const { Language } = require('../src').models

describe('Book Collection Translation', () => {
  beforeEach(async () => {
    await dbCleaner()
  })

  it('can add languages', async () => {
    await new Language({
      langIso: 'EL',
    })
      .save()
      .then(res => console.log(res))

    await new Language({
      langIso: 'en',
    })
      .save()
      .then(res => console.log(res))
  })
})
