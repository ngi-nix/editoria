const express = require('express')
const path = require('path')

const PagedPreviewer = app => {
  app.use('/paged', express.static(path.join(__dirname, '/')))
}

module.exports = PagedPreviewer
