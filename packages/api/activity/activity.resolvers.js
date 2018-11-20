// Example file
// const activity = async (_, args, ctx, info) => {
//   const activity = await ctx.models.activity.findById(args.input.id).exec()

//   if (!activity) {
//     throw new Error('Activity does not exist')
//   }

//   return activity
// }

// const activities = (_, __, ctx) => ctx.models.activity.find({}).exec()

// const newActivity = (_, args, ctx) => ctx.models.activity.create(args.input)

// module.exports = {
//   Query: {
//     activity,
//     activities,
//   },
//   Mutation: {
//     newActivity,
//   },
//   Activity: {
//     // placeholder for custom property resolvers
//   },
// }
