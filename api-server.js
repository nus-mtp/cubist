// Register babel to have ES6 support on the NodeJS server
require('babel-register')({
  presets: ['es2015', 'stage-0', 'react'],
  plugins: ['add-module-exports']
});

// Start the server app
require('./src/api');
