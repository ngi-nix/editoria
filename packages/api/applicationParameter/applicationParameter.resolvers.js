const { ApplicationParameter } = require('editoria-data-model/src').models

const getApplicationParameters = async (_, args, ctx) => {
  const { context, area } = args
  const parameters = await ApplicationParameter.query()
    .skipUndefined()
    .where({ context, area })

  // console.log(parameters)

  // console.log(
  //   parameters.map(parameter => {
  //     console.log(parameter.config,11111)
  //     parameter.config = JSON.parse(parameter.config)
  //     console.log(parameter.config, 222)
  //     return parameter
  //   }),
  // )

  return parameters
}
// const updateApplicationParameter = async (_, args, ctx) => {
//   const { context, area, config } = args

//   const parameter = await ApplicationParameter.query().findOne({
//     context,
//     area,
//   })

//   const updatedParameter = await parameter.$query().updateAndFetch({ config })
//   return updatedParameter
// }

module.exports = {
  Query: {
    getApplicationParameters,
  },
  // Mutation: {
  //   updateApplicationParameter,
  // },
}
