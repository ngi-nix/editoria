const indexOf = require('lodash/indexOf')
const find = require('lodash/find')
const utils = require('../helpers/utils')
const config = require('config')
const {
  Template,
  File,
  FileTranslation,
} = require('editoria-data-model/src').models

// const pubsweetServer = require('pubsweet-server')

// const { pubsubManager } = pubsweetServer
const getTemplates = async (_, {}, ctx) => {}
const getTemplate = async (_, {}, ctx) => {}

const createTemplate = async (_, {}, ctx) => {}
const updateTemplate = async (_, {}, ctx) => {}
const deleteTemplate = async (_, {}, ctx) => {}

module.exports = {
  Query: {
    getTemplates,
    getTemplate,
  },
  Mutation: {
    createTemplate,
    updateTemplate,
    deleteTemplate,
  },
  Template: {
    async files(divisionId, _, ctx) {
      // TODO:
    },
  },
  Subscription: {},
}
