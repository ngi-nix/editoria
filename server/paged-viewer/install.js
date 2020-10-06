;(async () => {
  const fs = require('fs-extra')
  const path = require('path')

  const pagedjsDistPath = path.join(
    `${process.cwd()}/`,
    'node_modules/pagedjs/dist/paged.js',
  )

  try {
    const distExistsLocally = await fs.pathExists(pagedjsDistPath)

    if (distExistsLocally) {
      await fs.ensureDir(path.join(`${__dirname}/`, 'lib'))
      await fs.copy(pagedjsDistPath, path.join(`${__dirname}/`, 'lib/paged.js'))
    } else {
      await fs.ensureDir(path.join(`${__dirname}/`, 'lib'))
      await fs.copy(
        path.join(`${process.cwd()}`, '/node_modules/pagedjs/dist/paged.js'),
        path.join(`${__dirname}/`, 'lib/paged.js'),
      )
    }
  } catch (e) {
    throw new Error(e)
  }
})()
