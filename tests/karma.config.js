import fs from 'fs'
import path from 'path'
import webpack from 'webpack'

function getExamples() {
  const examples = []
  fs
    .readdirSync('./src/examples/', {withFileTypes: true})
    .filter(r => r.isDirectory())
    .map(r => r.name)
    .forEach(r => fs.readdirSync(path.join('src/examples', r))
      .filter(r => r.startsWith('example'))
      .forEach(f => examples.push(path.join(r, path.basename(f, '.js')))))

  return examples
}

const integrationTests = JSON.stringify(getExamples().slice(0, 25))

export default function(config) {
  config.set({
    preprocessors: {
      './**/*.js': ['webpack'],
    },
    webpackMiddleware: {
      stats: {
        colors: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: false,
        errorDetails: false,
        warnings: false,
        publicPath: false
      }
    },
    webpack: {
      stats: 'none',
      mode: 'development',
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules)/,
          use: {loader: 'babel-loader'}
        },
        {
          test: /\.txt$/,
          use: {loader: 'raw-loader'},
        }]
      },
      plugins: [
        new webpack.EnvironmentPlugin(['NODE_ENV', 'BROWSER_TEST']),
        new webpack.DefinePlugin({integrationTests})
      ]
    },
    frameworks: ['mocha', 'chai'],
    files: [
      './integration/browser_spec.js',
      './promise_helpers_spec.js',
      './rate_limit_spec.js',
      './pump_spec.js',
      './interval_spec.js',
      './buffer_by_spec.js',
      './broadcast_spec.js'
    ],
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless', 'Firefox', 'FirefoxDeveloper', 'FirefoxNightly'],
    autoWatch: false,
    concurrency: Infinity,
    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless'],
      }
    }
  })
}
