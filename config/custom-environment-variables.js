module.exports = {
  flavour: 'EDITORIA_FLAVOUR',
  'pubsweet-client': {
    protocol: 'CLIENT_PROTOCOL',
    host: 'CLIENT_HOST',
    port: 'CLIENT_PORT',
  },
  'pubsweet-server': {
    host: 'SERVER_HOST',
    port: 'SERVER_PORT',
    secret: 'PUBSWEET_SECRET',
    db: {
      user: 'POSTGRES_USER',
      password: 'POSTGRES_PASSWORD',
      host: 'POSTGRES_HOST',
      database: 'POSTGRES_DB',
      port: 'POSTGRES_PORT',
    },
  },
  services: {
    'epub-checker': {
      clientId: 'SERVICE_EPUB_CHECKER_CLIENT_ID',
      clientSecret: 'SERVICE_EPUB_CHECKER_SECRET',
      url: 'SERVICE_EPUB_CHECKER_URL',
    },
    icml: {
      clientId: 'SERVICE_ICML_CLIENT_ID',
      clientSecret: 'SERVICE_ICML_SECRET',
      url: 'SERVICE_ICML_URL',
    },
    pagedjs: {
      clientId: 'SERVICE_PAGEDJS_CLIENT_ID',
      clientSecret: 'SERVICE_PAGEDJS_SECRET',
      url: 'SERVICE_PAGEDJS_URL',
    },
    xsweet: {
      clientId: 'SERVICE_XSWEET_CLIENT_ID',
      clientSecret: 'SERVICE_XSWEET_SECRET',
      url: 'SERVICE_XSWEET_URL',
    },
  },
  'file-server': {
    accessKeyId: 'S3_ACCESS_KEY_ID_USER',
    secretAccessKey: 'S3_SECRET_ACCESS_KEY_USER',
    bucket: 'S3_BUCKET',
    endpoint: 'S3_ENDPOINT',
    port: 'S3_PORT',
  },
  'password-reset': {
    url: 'PASSWORD_RESET_URL',
    sender: 'PASSWORD_RESET_SENDER',
  },
  mailer: {
    from: 'MAILER_SENDER',
    transport: {
      host: 'MAILER_HOSTNAME',
      auth: {
        user: 'MAILER_USER',
        pass: 'MAILER_PASSWORD',
      },
    },
  },
  'language-tools': {
    port: 'LANGUAGE_PORT',
    endpoint: 'LANGUAGE_ENDPOINT',
  },
}
