import Promise from 'bluebird';
import mongoose from 'mongoose';

import settings from './settings';
import {ClientError, Logger} from 'common';

const DEBUG_ENV = 'mongodb';

/**
 * Database Initialization
 */
export default (app) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(settings.DATABASE_URL, (err) => {
      const {host, port} = mongoose.connection;
      if (err) {
        reject(new ClientError(`Unable to connect to database: ${host}:${port}`));
      } else {
        Logger.info('Connected database: ' + host + ':' + port, DEBUG_ENV);
        resolve();
      }
    });
  });
};
