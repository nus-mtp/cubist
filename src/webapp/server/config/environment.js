import path from 'path';
import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import favIcon from 'serve-favicon';

import { Logger } from 'common';

export default (app) => {
  app.use(morgan('tiny', { stream: Logger.stream }));
  app.use(compression());
  app.use(favIcon(path.resolve(__dirname, '../../assets/favicon.ico')));
  // Only serve static files when in production mode
  if (process.env.NODE_ENV !== 'development') {
    app.use(express.static(path.resolve(__dirname, '../../../../public')));
  }
  app.use('/models', express.static(path.resolve(__dirname, '../../../../models/')));
};
