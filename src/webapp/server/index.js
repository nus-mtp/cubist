import express from 'express';
import Promise from 'bluebird';

import {Logger} from 'common';
import environment from './config/environment';
import routes from './config/routes';
import render from './config/render';
import settings from './config/settings';

const DEBUG_ENV = 'server';
const app = express();

const RenderServer = Promise.resolve()
  .then(() => {
    Logger.info('Node Environment: ' + process.env.NODE_ENV, DEBUG_ENV);
    Logger.info('Setting up environment...', DEBUG_ENV);
    return environment(app);
  })
  .then(() => {
    Logger.info('Setting up routes...', DEBUG_ENV);
    return routes(app);
  })
  .then(() => {
    Logger.info('Setting up rendering...', DEBUG_ENV);
    return render(app);
  })
  .then(() => {
    app.listen(settings.PORT);
    Logger.info('Server Started at port ' + settings.PORT, DEBUG_ENV);
  })
  .catch((err) => {
    Logger.error(err, DEBUG_ENV);
    process.kill(process.pid, 'SIGKILL');
  });

export default RenderServer;
