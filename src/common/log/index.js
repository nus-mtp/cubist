import split from 'split';

// Select logger configuration depending on node environment
let env = 'development';
if (process.env.NODE_ENV !== 'development') {
  env = 'production';
}
let logger;
if (!process.env.BROWSER) {
  logger = require('./' + env);
}

/**
 * Logger object with different log level functions
 * @type {Object}
 */
const Logger = {
  debug: function(str, debugEnv) {
    this.log(str, debugEnv, 'debug');
  },
  info: function(str, debugEnv) {
    this.log(str, debugEnv, 'info');
  },
  warn: function(str, debugEnv) {
    this.log(str, debugEnv, 'warn');
  },
  error: function(str, debugEnv) {
    this.log(str, debugEnv, 'error');
  },
  stream: split().on('data', (line) => {
    Logger.info(line, 'http');
  }),
  log: function(str, debugEnv = 'misc', level) {
    if (logger) {
      logger.log(level, `${debugEnv}: ${str}`);
    } else {
      console.log(`${level}: ${debugEnv}: ${str}`);
    }
  }
};

export default Logger;
