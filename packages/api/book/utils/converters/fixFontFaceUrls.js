const csstree = require('css-tree')

module.exports =  (stylesheet, fonts, where) => {
  const ast = csstree.parse(stylesheet.content)
  const allowedFiles = ['.otf', '.woff', '.woff2', '.ttf']
  const regex = new RegExp(
    `([a-zA-Z0-9\s_\\.\-:])+(${allowedFiles.join('|')})$`,
  )

  csstree.walk(ast, node => {
    if (node.type === 'Url' && regex.test(node.value.value)) {
      const temp = node.value.value
      for (let i = 0; i < fonts.length; i += 1) {
        if (new RegExp(fonts[i].basename).test(temp)) {
          node.value.value = `${where}/${fonts[i].basename}`
        }
      }
    }
  })
  stylesheet.content = csstree.generate(ast)
}
