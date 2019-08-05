
export default function(config) {
  config.set({
    preprocessors: {
      './promise_helpers_spec.js': ['webpack']
    },
    webpack: {
      mode: 'development',
    },
    frameworks: ['mocha', 'chai'],
    files: [
      './promise_helpers_spec.js'
    ],
    reporters: ['progress'],
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
