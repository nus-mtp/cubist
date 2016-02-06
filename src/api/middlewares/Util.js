import { StringHelper } from 'common';

export default {
  attachToken(req, res, next) {
    req.requestToken = StringHelper.randomToken();
    next();
  }
};
