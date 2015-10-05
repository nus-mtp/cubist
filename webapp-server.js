// Delete BROWSER variable to distinguish between client-side and server-side
delete process.env.BROWSER;

// Register babel to have ES6 support on the NodeJS server
require('babel/register')({
  stage: 0
});

// Start the server app
require('webapp/server');
