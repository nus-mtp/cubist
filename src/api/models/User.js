import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import Promise from 'bluebird';
import _ from 'lodash';

import { Constants } from 'common';
import settings from 'api/config/settings';
import { MongooseHelper } from 'api/helpers';

// Schema Definition
const User = new Schema({
  _hashedPassword: { type: String, required: true },
  name: {
    type: String,
    unique: true,
    required: true,
    index: true,
    trim: true
  },
  role: {
    type: String,
    enum: [Constants.ROLE_ADMIN, Constants.ROLE_USER],
    default: Constants.ROLE_USER
  },
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
    lowercase: true,
    trim: true
  },
  createdAt: { type: Date, index: true, default: Date.now },
  updatedAt: { type: Date, index: true, default: Date.now }
});

// ----------------------------------------------------------------------------//

/**
 * Check if there is any error in the fields of user
 * @param  { User } user [user to process field validation]
 * @param  { { String: Boolean } } fields [list of fields need to validate]
 * @return { String }        [error message if validation fails]
 */
User.statics.validate = function (user, fields) {
  if (fields.name) {
    if (!user.name) {
      return Constants.ERROR_USER_NAME_REQUIRED;
    }
    if (user.name.trim().length < Constants.USER_NAME_MIN_LENGTH) {
      return Constants.ERROR_USER_NAME_MIN_LENGTH;
    }
  }
  if (fields.email) {
    if (!user.email) {
      return Constants.ERROR_USER_EMAIL_REQUIRED;
    }
    if (user.email.trim().length < Constants.USER_EMAIL_MIN_LENGTH) {
      return Constants.ERROR_USER_EMAIL_MIN_LENGTH;
    }
  }
  if (fields._id) {
    if (!user._id) {
      return Constants.ERROR_USER_ID_REQUIRED;
    }
  }
  if (fields.password) {
    if (!user.password) {
      return Constants.ERROR_USER_PASSWORD_REQUIRED;
    }
    if (user.password.trim().length < Constants.USER_PASSWORD_MIN_LENGTH) {
      return Constants.ERROR_USER_PASSWORD_MIN_LENGTH;
    }
    if (user.password.trim().length > Constants.USER_PASSWORD_MAX_LENGTH) {
      return Constants.ERROR_USER_PASSWORD_MAX_LENGTH;
    }
  }

  return null;
};

/**
 * Find single user by email
 * @param  { String } email [email of the user]
 * @return { Promise }       [promise of the query result]
 */
User.statics.findOneByEmail = function (email) {
  return Promise.resolve(this.findOne({ email }).exec());
};

/**
 * Find single user by email or name
 * @param  { String } email [email of the user]
 * @param  { String } name [username of the user]
 * @return { Promise } [promise of the query result]
 */
User.statics.findOneByUsernameOrEmail = function (email, name) {
  return Promise.resolve(this.findOne({
    $or: [
      { email },
      { name }
    ]
  }));
};

/**
 * Find single user by user ID
 * @param  { String } userId [id of the user]
 * @return { Promise }        [promise of the query result]
 */
User.statics.findByUserId = function (userId) {
  return Promise.resolve(this.findById(userId).exec());
};

/**
 * Create an admin user
 * @return { Promise } [promise of the create result]
 */
User.statics.createAdmin = function () {
  return this.createUser({
    name: settings.ADMIN_NAME,
    role: Constants.ROLE_ADMIN,
    email: settings.ADMIN_EMAIL,
    password: settings.ADMIN_PASSWORD
  });
};

/**
 * Create a single user with the password being hashed
 * @param  { String } options.name [name of the user]
 * @param  { String } options.email [email of the user]
 * @param  { String } options.password [password of the user]
 * @param  { String } options.role [role of the user]
 * @return { Promise } [promise of the create result]
 */
User.statics.createUser = function (user) {
  const {
    name, email, password, role = Constants.ROLE_USER
  } = _.pick(user, ['name', 'email', 'password', 'role']);

  return Promise.resolve()
    .then(() => {
      return this.hashPassword(password);
    })
    .then(hashedPassword => {
      const hashedUser = {
        _hashedPassword: hashedPassword,
        name,
        role,
        email
      };

      return MongooseHelper.create(this, hashedUser);
    });
};

/**
 * Change password of a user
 * @param  { String } userId           [id of the user]
 * @param  { String } options.password [new password of the user]
 * @return { Promise }                  [promise of the update result]
 */
User.statics.changePassword = function (userId, { password }) {
  return Promise.resolve()
    .then(() => {
      return this.hashPassword(password);
    })
    .then((hashedPassword) => {
      const update = {
        $set: {
          _hashedPassword: hashedPassword
        }
      };

      return Promise.resolve(this.findByIdAndUpdate(userId, update).exec());
    });
};

/**
 * Hash a string to be used as password
 * @param  { String } password [the original password]
 * @return { Promise }          [promise of the hashed password]
 */
User.statics.hashPassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 8, (err, hashedPassword) => {
      if (err) {
        reject(err);
      } else {
        resolve(hashedPassword);
      }
    });
  });
};

export default mongoose.model('User', User, 'User');
