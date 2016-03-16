import fs from 'fs';
import path from 'path';

// Select settings files depending on node environment
let configFile = 'development';
if (process.env.NODE_ENV !== 'development') {
  configFile = 'production';
}
const config = require('./' + configFile);

// Check for private configuration
const hasPrivateConfig = fs.statSync(path.resolve(__dirname, './private.js')).isFile();
const privateConfig = hasPrivateConfig ? require('./private') : {};

export default Object.assign({}, config, privateConfig);
