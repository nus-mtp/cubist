import fs from 'fs';
import path from 'path';

// Select settings files depending on node environment
let configFile = 'development';
if (process.env.NODE_ENV !== 'development') {
  configFile = 'production';
}
const config = require('./' + configFile);

// Check for private configuration
let privateConfig;
try {
  const hasPrivateConfig = fs.accessSync(path.resolve(__dirname, './private.js'));
  privateConfig = hasPrivateConfig ? require('./private') : {};
} catch (err) {
  /* eslint-disable no-console */
  console.log('No `private.js` file exists');
  /* eslint-enable no-console */
}

export default Object.assign({}, config, privateConfig);
