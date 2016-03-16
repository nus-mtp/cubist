import Promise from 'bluebird';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';

import { ClientError, Constants, StringHelper } from 'common';
import { User } from 'api/models';
import { MongooseHelper, ResponseHelper, SendgridHelper } from 'api/helpers';
import settings from 'api/config/settings';

const DEBUG_ENV = 'UserController';

const UserController = {
  request: {},
  promise: {}
};

// ---------------------------------------------------------------------------- //

UserController.request.getUser = function (req, res) {
  ResponseHelper.handle(UserController.promise.getUser, req, res, DEBUG_ENV);
};

UserController.request.me = function (req, res) {
  ResponseHelper.handle(UserController.promise.me, req, res, DEBUG_ENV);
};

UserController.request.info = function (req, res) {
  UserController.promise.me(req, true)
    .then(user => ResponseHelper.success(res, user))
    .catch(error => ResponseHelper.error(res, error, DEBUG_ENV));
};

UserController.request.register = function (req, res) {
  ResponseHelper.handle(UserController.promise.register, req, res, DEBUG_ENV);
};

UserController.request.login = function (req, res) {
  UserController.promise.login(req, false)
    .then(user => {
      res.cookie(Constants.TOKEN_KEY, user.token);
      ResponseHelper.success(res, user);
    })
    .catch(error => ResponseHelper.error(res, error, DEBUG_ENV));
};

UserController.request.adminLogin = function (req, res) {
  UserController.promise.login(req, true)
    .then(user => {
      res.cookie(Constants.TOKEN_KEY, user.token);
      ResponseHelper.success(res, user);
    })
    .catch(error => ResponseHelper.error(res, error, DEBUG_ENV));
};

UserController.request.logout = function (req, res) {
  res.clearCookie(Constants.TOKEN_KEY);
  ResponseHelper.success(res, {});
};

UserController.request.resetPassword = function (req, res) {
  ResponseHelper.handle(UserController.promise.resetPassword, req, res, DEBUG_ENV);
};

UserController.request.changePassword = function (req, res) {
  ResponseHelper.handle(UserController.promise.changePassword, req, res, DEBUG_ENV);
};

// ---------------------------------------------------------------------------- //

UserController.promise.getUser = function (req) {
  const { query, options } = req.query;
  return User.getUser(query, options);
};

UserController.promise.me = function (req, needAuthorized = false) {
  if (needAuthorized && !req.user) {
    return Promise.reject(new ClientError(Constants.ERROR_TOKEN_UNVERIFIED));
  }
  if (!req.user) {
    return Promise.resolve();
  }

  const error = User.validate(req.user, {
    _id: true
  });
  if (error) {
    return Promise.reject(new ClientError(error));
  }

  const userId = req.user._id;
  if (!needAuthorized) {
    return User.findByUserId(userId);
  }

  return User.findByUserId(userId).then(MongooseHelper.checkExists);
};

UserController.promise.login = function (req, isAdminLogin) {
  const { email, password } = req.body;
  const error = User.validate(req.body, {
    email: true,
    password: true
  });
  if (error) {
    return Promise.reject(new ClientError(error));
  }

  return User.findOneByEmail(email)
    .then(MongooseHelper.checkExists)
    .then(MongooseHelper.toObject)
    .then((user) => {
      // Check if this is for admin login
      if (isAdminLogin) {
        if (user.role !== Constants.ROLE_ADMIN) {
          return Promise.reject(new ClientError(Constants.ERROR_USER_ROLE_NOT_ADMIN));
        }
      }

      // Compare password normally if this is user login
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user._hashedPassword, (err, res) => {
          if (err) {
            reject(err);
          } else if (!res) {
            reject(new ClientError(Constants.ERROR_USER_PASSWORD_INCORRECT));
          } else {
            resolve(user);
          }
        });
      });
    })
    .then((user) => {
      const tokenPayload = _.pick(user, '_id', 'email', 'role');
      const token = jwt.sign(tokenPayload, settings.JWT_SECRET, {
        expiresInMinutes: 90 * 24 * 60
      });
      user.token = token;
      return user;
    }
  );
};

UserController.promise.register = function (req) {
  const user = _.pick(req.body, 'name', 'email', 'password');
  const error = User.validate(user, {
    name: true,
    email: true,
    password: true
  });
  if (error) {
    return Promise.reject(new ClientError(error));
  }

  return User.findOneByUsernameOrEmail(user.email)
    .then(MongooseHelper.checkNil)
    .then(() => {
      return User.createUser(user);
    });
};

UserController.promise.resetPassword = function (req) {
  const { email } = req.body;
  const error = User.validate({ email }, { email: true });
  if (error) {
    return Promise.reject(new ClientError(error));
  }
  const newPassword = StringHelper.randomToken();

  return User.findOneByEmail(email)
    .then(MongooseHelper.checkExists)
    .then(user => User.changePassword(user._id, { password: newPassword }))
    .then(user => SendgridHelper.resetPassword(newPassword, user));
};

UserController.promise.changePassword = function (req) {
  const { oldPassword, newPassword, newConfirmedPassword } = req.body;
  const error = User.validate({ password: oldPassword }, { password: true })
    || User.validate({ password: newPassword }, { password: true })
    || User.validate({ password: newConfirmedPassword }, { password: true })
    || User.validate(req.user, { _id: true });
  if (error) {
    return Promise.reject(new ClientError(error));
  }

  if (newPassword !== newConfirmedPassword) {
    return Promise.reject(new ClientError(Constants.ERRORUser_CONFIRMED_PASSWORD_MISMATCH));
  }

  return User.findByUserId(req.user._id)
    .then(MongooseHelper.checkExists)
    .then((user) => {
      return new Promise((resolve, reject) => {
        bcrypt.compare(oldPassword, user._hashedPassword, (err, res) => {
          if (err) {
            reject(err);
          } else if (!res) {
            reject(new ClientError(Constants.ERRORUser_PASSWORD_INCORRECT));
          } else {
            resolve(user);
          }
        });
      });
    })
    .then(() => {
      return User.changePassword(req.user._id, {
        password: newPassword
      });
    });
};

export default UserController;
