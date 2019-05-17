const path = require('path')

/*
  Registers an array of components on pubsweet's config, so that the migrations
  are ran. Will treat a string as a single component.

  Valid input examples:
  - ['book', 'bookCollection']
  - 'book'

  Only works for this package, as it assumes a specific structure to locate
  the different models.
*/

const registerComponents = componentNames => {
  let components = componentNames
  const paths = []

  if (typeof componentNames === 'string') {
    components = [componentNames]
  } else if (!Array.isArray(componentNames)) {
    throw new Error('Component names need to be an array or a string')
  }

  components.forEach(comp => {
    const componentPath = path.resolve(__dirname, '..', '..', 'src', comp)
    paths.push(componentPath)
  })

  const toString = paths.map(p => `"${p}"`).join(', ')
  // console.log(`{"pubsweet":{"components":[${toString}]}}`)
  // return `{"pubsweet":{"components":[${toString}]}}`
  process.env.NODE_CONFIG = `{"pubsweet":{"components":[${toString}]}}`
}

module.exports = registerComponents
