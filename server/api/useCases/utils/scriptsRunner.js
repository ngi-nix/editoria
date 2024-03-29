const fs = require('fs-extra')
const find = require('lodash/find')
const config = require('config')
const map = require('lodash/map')

const scriptsRunner = async (book, template) => {
  try {
    // init
    const bookComponents = {}
    const ids = []
    const paths = []

    book.divisions.forEach(division => {
      division.bookComponents.forEach(bookComponent => {
        const { id, content } = bookComponent
        bookComponents[id] = content
        ids.push(id)
      })
    })

    for (let i = 0; i < template.exportScripts.length; i += 1) {
      const { value } = template.exportScripts[i]
      const deconstructedValue = value.split('-')
      const label = deconstructedValue[0]
      const scope = deconstructedValue[1]

      const scriptsRootFolder = config.get('export.rootFolder')
      const availableScripts = config.get('export.scripts')

      if (!scriptsRootFolder || !availableScripts) {
        throw new Error(`something went wrong with your scripts configuration`)
      }

      const foundScript = find(availableScripts, { label, scope })

      if (!foundScript) {
        throw new Error(
          `template has a script which does not exist in the configurations`,
        )
      }

      const constructedScriptPath = `${process.cwd()}/${scriptsRootFolder}/${
        foundScript.filename
      }`
      if (!fs.existsSync(constructedScriptPath)) {
        throw new Error(
          `the script file declared in the config does not exist under ${process.cwd()}/${scriptsRootFolder}/`,
        )
      }

      paths.push(constructedScriptPath)
    }

    const scripts = paths.map(path => require(path))

    await Promise.all(
      map(ids, async id => {
        const content = bookComponents[id]
        if (content && content.length > 0) {
          return (bookComponents[id] = await scripts.reduce(
            async (accumulated, currentFunc) => {
              const content = await accumulated
              return currentFunc(content)
            },
            content,
          ))
        }
        return bookComponents[id]
      }),
    )
    return bookComponents
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = { scriptsRunner }
