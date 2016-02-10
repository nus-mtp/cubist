import { Logger, Constants } from 'common';

export default {
  handle(handler, req, res, debugEnv) {
    handler(req)
      .then(result => this.success(res, result))
      .catch(err => this.error(res, err, debugEnv));
  },
  // Error Server Response
  error: (res, err, debugEnv) => {
    Logger.error(err.stack, debugEnv);
    res.status(err.statusCode || Constants.STATUS_BAD_REQUEST);
    if (process.env.NODE_ENV !== 'development') {
      delete err.stack;
    }
    res.send({
      // Message is hidden by default in Error object
      message: err.message,
      ...err
    });
  },
  // Success Server Response
  success: (res, data) => {
    res.status(Constants.STATUS_SUCCESS);
    res.send(data);
  }
};
