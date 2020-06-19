const csstree = require('css-tree')
const beautifulCSS = require('js-beautify').css

module.exports = (content, fonts, where) => {
  const ast = csstree.parse(content)
  const allowedFiles = ['.otf', '.woff', '.woff2', '.ttf']
  const regex = new RegExp(
    `([a-zA-Z0-9\s_\\.\-:])+(${allowedFiles.join('|')})$`,
  )

  csstree.walk(ast, node => {
    if (node.type === 'Url' && regex.test(node.value.value)) {
      const temp = node.value.value
      for (let i = 0; i < fonts.length; i += 1) {
        if (new RegExp(fonts[i].originalFilename).test(temp)) {
          node.value.value = `${where}/${fonts[i].originalFilename}`
        }
      }
    }
  })
  return beautifulCSS(csstree.generate(ast))
}
