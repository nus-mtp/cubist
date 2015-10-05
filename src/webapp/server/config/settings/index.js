// Select settings files depending on node environment
let configFile = 'development';
if (process.env.NODE_ENV !== 'development') {
  configFile = 'production';
}

const config = require('./' + configFile);
export default config;
