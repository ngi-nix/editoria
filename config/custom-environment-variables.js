module.exports = {
  flavour: 'EDITORIA_FLAVOUR',
  'pubsweet-server': {
    secret: 'PUBSWEET_SECRET',
    db: {
      user: 'POSTGRES_USER',
      password: 'POSTGRES_PASSWORD',
      host: 'POSTGRES_HOST',
      database: 'POSTGRES_DB',
      port: 'POSTGRES_PORT',
    },
    port: 'SERVER_PORT',
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
