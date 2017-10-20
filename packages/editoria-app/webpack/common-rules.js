const path = require('path')
// const config = require(`../config/${process.env.NODE_ENV}.js`)
const babelIncludes = require('./babel-includes')
const config = require('config')

const resolve = (type, entry) => {
  if (typeof entry === 'string') {
    return require.resolve(`babel-${type}-${entry}`)
  } else {
    return [require.resolve(`babel-${type}-${entry[0]}`), entry[1]]
  }
}

const resolvePreset = entry => resolve('preset', entry)
const resolvePlugin = entry => resolve('plugin', entry)

const clientComponents = config.pubsweet.components.filter((name) => {
  const component = require(name)
  // Backwards compatibility - old name was 'frontend', new name is 'client'
  return component.client || component.frontend
})

module.exports = [
  {
    test: /\.js$|\.jsx$/,
    loader: 'babel-loader',
    query: {
      presets: [
        ['es2015', { modules: false }],
        'react',
        'stage-2'
      ].map(resolvePreset),
      plugins: [
        'react-hot-loader/babel',
        resolvePlugin('transform-decorators-legacy')
      ],
      env: {
        production: {
          presets: ['babili']
        }
      }
    },
    include: babelIncludes
  },
  { test: /\.png$/, loader: 'url-loader' },
  {
    test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
    loader: [
      {
        loader: 'url-loader',
        options: {
          prefix: 'font',
          limit: 1000
        }
      }
    ]
  },
  { test: /\.html$/, loader: 'html-loader' },
  { test: /\.json$/, loader: 'json-loader' },
  { test: /\.css$|\.scss$/,
    exclude: /\.local\.s?css$/, // Exclude local styles from global
    loader: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'sass-loader',
        options: {
          includePaths: [path.join(__dirname, '..', 'node_modules')]
        }
      }
    ]
  },
  { test: /\.css$|\.scss$/,
    include: /\.local\.s?css/, // Local styles
    loader: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 1,
          localIdentName: '[name]_[local]-[hash:base64:8]'
        }
      },
      {
        loader: 'sass-loader',
        options: {
          includePaths: [path.join(__dirname, '..', 'node_modules')]
        }
      }
    ]
  },
  {
    test: /\.js$|\.jsx$/,
    loader: 'string-replace-loader',
    query: {
      search: 'PUBSWEET_COMPONENTS',
      replace: '[' + clientComponents.map(component => `require('${component}')`).join(', ') + ']'
    },
    include: babelIncludes
  }
]
