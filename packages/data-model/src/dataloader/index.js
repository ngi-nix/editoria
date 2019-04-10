module.exports = {
  models: [
    { modelName: 'UserLoader', model: require('./loaders/userLoader') },
    {
      modelName: 'BookComponentStateLoader',
      model: require('./loaders/bookComponentStateLoader'),
    },
    {
      modelName: 'DivisionLoader',
      model: require('./loaders/divisionLoader'),
    },
  ],
}
