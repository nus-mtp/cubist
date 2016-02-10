import jwt from 'jsonwebtoken';

import { ClientError, Constants } from 'common';
import { ResponseHelper } from 'api/helpers';
import settings from 'api/config/settings';

const DEBUG_ENV = 'Authorisation';

export default {
  checkUser(req, res, next) {
    const token = req.cookies[Constants.TOKEN_KEY];
    if (token) {
      jwt.verify(token, settings.JWT_SECRET, (err, decoded) => {
        if (!err) {
          req.user = decoded;
        }
        next();
      });
    } else {
      next();
    }
  },

  requireUser(req, res, next) {
    const token = req.cookies[Constants.TOKEN_KEY];
    if (!token) {
      ResponseHelper.error(
        res,
        new ClientError(Constants.ERROR_TOKEN_DID_NOT_EXIST, Constants.STATUS_UNAUTHORIZED),
        DEBUG_ENV
      );
    } else {
      jwt.verify(token, settings.JWT_SECRET, (err, decoded) => {
        if (err) {
          ResponseHelper.error(
            res,
            new ClientError(Constants.ERROR_TOKEN_UNVERIFIED, Constants.STATUS_UNAUTHORIZED),
            DEBUG_ENV
          );
        } else {
          req.user = decoded;
          next();
        }
      });
    }
  },

  requireAdmin(req, res, next) {
    const token = req.cookies[Constants.TOKEN_KEY];
    if (!token) {
      ResponseHelper.error(
        res,
        new ClientError(Constants.ERROR_ADMIN_TOKEN_DID_NOT_EXIST, Constants.STATUS_UNAUTHORIZED),
        DEBUG_ENV
      );
    } else {
      jwt.verify(token, settings.JWT_SECRET, (err, decoded) => {
        if (err) {
          ResponseHelper.error(
            res,
            new ClientError(Constants.ERROR_ADMIN_TOKEN_UNVERIFIED, Constants.STATUS_UNAUTHORIZED),
            DEBUG_ENV
          );
        } else if (decoded.role !== Constants.ROLE_ADMIN) {
          ResponseHelper.error(
            res,
            new ClientError(Constants.ERROR_ADMIN_TOKEN_INVALID, Constants.STATUS_UNAUTHORIZED),
            DEBUG_ENV
          );
        } else {
          req.user = decoded;
          next();
        }
      });
    }
  }
};
