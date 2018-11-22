const schema = {
  arrayOfIds: {
    type: 'array',
    items: {
      type: 'string',
      format: 'uuid',
    },
  },
  arrayOfStrings: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
  arrayOfStringsNotEmpty: {
    type: 'array',
    items: {
      type: 'string',
      minLength: 1,
    },
  },
  booleanDefaultFalse: {
    type: 'boolean',
    default: false,
  },
  date: {
    type: 'string',
    format: 'date-time',
  },
  email: {
    type: 'string',
    format: 'email',
  },
  foreignType: {
    type: 'string',
    enum: [
      'book',
      'bookCollection',
      'bookCollectionTranslation',
      'bookComponent',
      'bookComponentState',
      'bookComponentTranslation',
      'bookTranslation',
      'contributor',
      'division',
      'file',
      'fileTranslation',
      'language',
      'lock',
      'sponsor',
    ],
  },
  id: {
    type: 'string',
    format: 'uuid',
  },
  integerPositive: {
    type: 'integer',
    exclusiveMinimum: 0,
  },
  mimetype: {
    type: 'string',
    pattern: /^(application|audio|font|image|model|multipart|text|video)\/[a-z0-9]+([-+.][a-z0-9]+)*$/,
    // if you want to know why this is default, look at
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
    default: 'application/octet-stream',
  },
  object: {
    type: 'object',
  },
  string: {
    type: 'string',
  },
  stringNotEmpty: {
    type: 'string',
    minLength: 1,
  },
  uri: {
    type: 'string',
    format: 'uri',
  },
  year: {
    type: 'string',
    pattern: '(19|20d{2})',
  },
}

module.exports = {
  schema,
}
