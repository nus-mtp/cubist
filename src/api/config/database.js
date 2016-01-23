import Promise from 'bluebird';
import mongoose from 'mongoose';

import settings from './settings';
import { User } from 'api/models';
import { ClientError, Logger } from 'common';

const DEBUG_ENV = 'mongodb';

/**
 * Server Database Initialization
 */
export default () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(settings.DATABASE_URL, (err) => {
      const { host, port } = mongoose.connection;
      if (err) {
        reject(new ClientError(`Unable to connect to database: ${host}:${port}`));
      } else {
        Logger.info('Connected database: ' + host + ':' + port, DEBUG_ENV);
        resolve();
      }
    });
  })
  .then(() => {
    return User.findOneByEmail(settings.ADMIN_EMAIL)
    .then((user) => {
      if (user) {
        return Promise.resolve();
      }
      return User.createAdmin();
    });
  });
};
