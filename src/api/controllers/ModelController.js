import Promise from 'bluebird';

import { ResponseHelper } from 'api/helpers';
import { Model } from 'api/models';

const DEBUG_ENV = 'UserController';

const ModelController = {
  request: {},
  promise: {}
};

// ---------------------------------------------------------------------------- //
ModelController.request.getModel = function (req, res) {
  ModelController.promise.getModel(req)
    .then(model => ResponseHelper.success(res, model))
    .catch(error => ResponseHelper.error(res, error, DEBUG_ENV));
};

// ---------------------------------------------------------------------------- //
ModelController.promise.getModel = function () {
  return Promise.resolve(Model.findOne().exec());
};

export default ModelController;
