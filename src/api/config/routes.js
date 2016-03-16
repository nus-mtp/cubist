import multer from 'multer';

import { Authorisation, Util } from 'api/middlewares';
import { UserController, ModelController } from 'api/controllers';
import { StorageHelper } from 'api/helpers';

const modelUpload = multer({ storage: StorageHelper.getModelStorage() });
const snapshotUpload = multer({ storage: StorageHelper.getSnapshotStorage() });

export default (app) => {
  // Authentication
  app.get('/user', UserController.request.getUser);
  app.get('/user/me', Authorisation.checkUser, UserController.request.me);
  app.get('/user/userInfo', Authorisation.requireUser, UserController.request.info);
  app.get('/user/adminInfo', Authorisation.requireAdmin, UserController.request.info);

  app.post('/user/register', UserController.request.register);
  app.post('/user/login', UserController.request.login);
  app.post('/user/adminLogin', UserController.request.adminLogin);
  app.post('/user/resetPassword', UserController.request.resetPassword);
  app.post('/user/logout', Authorisation.requireUser, UserController.request.logout);

  // Model
  app.get('/model', ModelController.request.getModels);
  app.get('/model/:modelId', ModelController.request.getModel);
  app.get('/models/top', ModelController.request.getTopModels);
  app.get('/models/latest', ModelController.request.getLatestModels);
  app.get('/browse', ModelController.request.getBrowsePageModels);

  app.post(
    '/model',
    Authorisation.requireUser,
    Util.attachToken,
    modelUpload.array('modelFiles'),
    ModelController.request.createModel
  );

  app.put(
    '/model/:modelId/addSnapshots',
    Util.attachToken,
    snapshotUpload.array('imageFiles'),
    Authorisation.requireUser,
    ModelController.request.addSnapshots
  );
  app.put(
    '/model/:modelId/deleteSnapshot',
    Authorisation.requireUser,
    ModelController.request.deleteSnapshot
  );
  app.put(
    '/model/:modelId/info',
    Authorisation.requireUser,
    ModelController.request.updateModelInfo
  );
  app.put('/model/:modelId/views', ModelController.request.incrementViews);
};
