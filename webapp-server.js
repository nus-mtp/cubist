// Delete BROWSER variable to distinguish between client-side and server-side
delete process.env.BROWSER;

// Register babel to have ES6 support on the NodeJS server
require('babel-register')({
  plugins: ['add-module-exports'],
  presets: ['es2015', 'stage-0', 'react']
});

// Start the server app
require('webapp/server');
