const path = require('path')
const fs = require('fs-extra')
const config = require('config')
const { pick } = require('lodash')
const rules = require('./common-rules')

// const contentBase = path.resolve(__dirname, '..', '_build', 'assets')
const entryPoint = path.join(process.cwd(), 'app')
const output = path.join(process.cwd(), '_build', 'assets')

// can't use node-config in webpack so save whitelisted client config into the build and alias it below
const clientConfig = pick(config, config.publicKeys)
fs.ensureDirSync(output)
const clientConfigPath = path.join(output, 'client-config.json')
fs.writeJsonSync(clientConfigPath, clientConfig, { spaces: 2 })

const plugins = require('./plugins')

module.exports = webpackEnv => {
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'

  const serverProtocol = process.env.SERVER_PROTOCOL
  const serverHost = process.env.SERVER_HOST
  const serverPort = process.env.SERVER_PORT
  const serverUrl = `${serverHost}${serverPort ? `:${serverPort}` : ''}`
  const serverUrlWithProtocol = `${serverProtocol}://${serverUrl}`

  const devServerHost = process.env.CLIENT_HOST
  const devServerPort = process.env.CLIENT_PORT

  return {
    devServer: {
      port: devServerPort,
      disableHostCheck: true,
      host: devServerHost,
      hot: true,
      contentBase: path.join(output, 'public'),
      publicPath: '/',
      proxy: {
        '/api': serverUrlWithProtocol,
        '/auth': serverUrlWithProtocol,
        '/graphql': serverUrlWithProtocol,
        '/vivliostyle': serverUrlWithProtocol,
        '/subscriptions': {
          target: `ws://${serverUrl}`,
          ws: true,
        },
        '/uploads': serverUrlWithProtocol,
      },
      historyApiFallback: true,
    },
    name: 'Editoria app',
    target: 'web',
    mode: webpackEnv,
    context: entryPoint,
    entry: {
      app: isEnvDevelopment ? ['react-hot-loader/patch', './app'] : ['./app'],
    },
    output: {
      path: output,
      publicPath: '/',
      filename: isEnvProduction
        ? 'js/[name].[contenthash:8].js'
        : isEnvDevelopment && 'js/bundle.js',
      // TODO: remove this when upgrading to webpack 5
      futureEmitAssets: true,
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isEnvProduction
        ? 'js/[name].[contenthash:8].chunk.js'
        : isEnvDevelopment && 'js/[name].chunk.js',
    },
    devtool: 'cheap-module-source-map',
    module: {
      rules,
    },
    resolve: {
      alias: {
        joi: 'joi-browser',
        config: clientConfigPath,
      },
      extensions: ['.mjs', '.js', '.jsx', '.json', '.scss'],
      enforceExtension: false,
    },
    plugins: plugins({
      hmr: isEnvDevelopment,
      html: true,
      noEmitOnErrors: true,
      extractText: isEnvProduction,
      env: webpackEnv,
    }),
  }
}
