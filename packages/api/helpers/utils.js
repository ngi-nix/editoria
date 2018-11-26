const utils = {}

utils.getLanguageId = async (ctx, langISO) => {
  const language = await ctx.models.language.findByISO({ langISO }).exec()
  return language.id
}

module.exports = utils
