
export default function(config) {
  config.set({
    preprocessors: {
      './promise_helpers_spec.js': ['webpack'],
      './rate_limit_spec.js': ['webpack']
    },
    webpack: {
      mode: 'development',
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules)/,
          use: {loader: 'babel-loader'}
        }]
      }
    },
    frameworks: ['mocha', 'chai'],
    files: [
      './promise_helpers_spec.js',
      './rate_limit_spec.js'
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
