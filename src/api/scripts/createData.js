import Promise from 'bluebird';

import { connectDb } from '../config/database';
import { Model, User } from '../models';

connectDb()
  // Clear Database
  .then(() => {
    return Promise.all([
      Promise.resolve(Model.remove({}).exec()),
      Promise.resolve(User.remove().exec())
    ]);
  })
  .then(() => {
    process.exit();
  });
