const csstree = require('css-tree')
const beautifulCSS = require('js-beautify').css

module.exports = (content, fonts, where) => {
  const ast = csstree.parse(content)
  const allowedFiles = ['otf', 'woff', 'woff2', 'ttf']

  csstree.walk(ast, node => {
    if (node.type === 'Url') {
      const temp = node.value.value
      const deconstruct = temp.split('.')
      const ext = deconstruct[deconstruct.length - 1]
      if (allowedFiles.indexOf(ext) !== -1) {
        for (let i = 0; i < fonts.length; i += 1) {
          if (new RegExp(fonts[i].originalFilename).test(temp)) {
            node.value.value = `${where}/${fonts[i].originalFilename}`
          }
        }
      }
    }
  })
  return beautifulCSS(csstree.generate(ast))
}
