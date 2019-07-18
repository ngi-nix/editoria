const { ApplicationParameter } = require('editoria-data-model/src').models

const getApplicationParameters = async (_, args, ctx) => {
  const { context, area } = args
  const parameters = await ApplicationParameter.query().where({ context, area })
  return parameters
}

const updateApplicationParameter = async (_, args, ctx) => {
  const { context, area, config } = args

  const parameter = await ApplicationParameter.query().findOne({
    context,
    area,
  })

  const updatedParameter = await parameter.$query().updateAndFetch({ config })
  return updatedParameter
}

module.exports = {
  Query: {
    getApplicationParameters,
  },
  Mutation: {
    updateApplicationParameter,
  },
}
