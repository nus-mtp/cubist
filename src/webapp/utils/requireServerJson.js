let fs;
let path;
if (!process.env.BROWSER) {
  fs = require('fs');
  path = require('path');
}

export default function(dirName, jsonPath) {
  if (!jsonPath) {
    return '';
  }
  if (process.env.BROWSER) {
    throw new Error('Server json resolver should not be called on client side');
  }

  return JSON.parse(fs.readFileSync(path.resolve(dirName, jsonPath), 'utf8'));
}
