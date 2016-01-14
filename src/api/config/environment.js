import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import methodOverride from 'method-override';

import { Logger } from 'common';

/**
 * Server Environment Initialization
 */
export default (app) => {
  app.use(morgan('tiny', { stream: Logger.stream }));
  app.use(bodyParser.json());
  app.use(bodyParser.text());
  app.use(cookieParser());
  app.use(methodOverride());
  app.use(compression());
};
