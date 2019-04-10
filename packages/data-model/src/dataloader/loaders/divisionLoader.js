const Loader = require('../loader')
const { model } = require('../../bookComponent')

const DivisionLoader = {
  bookComponents: new Loader(
    async divisionId =>
      // eslint-disable-next-line no-return-await
      await model
        .query()
        .select('book_component.*', 'book_component_translation.title')
        .innerJoin(
          'book_component_translation',
          'book_component.id',
          'book_component_translation.book_component_id',
        )
        .where('book_component_translation.language_iso', 'en')
        .where('book_component.division_id', divisionId)
        .andWhere('book_component.deleted', false),
  ),
}

module.exports = DivisionLoader
