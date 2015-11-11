import express from 'express';
import Promise from 'bluebird';

import environment from './config/environment';
import database from './config/database';
import routes from './config/routes';
import { Logger } from 'common';
import settings from './config/settings';

const DEBUG_ENV = 'server';
const app = express();

const ApiServer = Promise.resolve()
  .then(() => {
    Logger.info('Node Environment: ' + process.env.NODE_ENV, DEBUG_ENV);
    Logger.info('Setting up environment...', DEBUG_ENV);
    return environment(app);
  })
  .then(() => {
    Logger.info('Settings up database...', DEBUG_ENV);
    return database(app);
  })
  .then(() => {
    Logger.info('Setting up routes...', DEBUG_ENV);
    return routes(app);
  })
  .then(() => {
    app.listen(settings.PORT);
    Logger.info('Server Started at port ' + settings.PORT, DEBUG_ENV);
  })
  .catch((err) => {
    Logger.error(err.stack, DEBUG_ENV);
    process.kill(process.pid, 'SIGKILL');
  });

export default ApiServer;
