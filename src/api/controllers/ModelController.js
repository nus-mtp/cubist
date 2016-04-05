import Promise from 'bluebird';
import _ from 'lodash';
import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';

import { ClientError, Constants, StringHelper } from 'common';
import { MongooseHelper, ResponseHelper, TextureHelper, ModelHelper } from 'api/helpers';
import { Model, User } from 'api/models';

const DEBUG_ENV = 'UserController';

const ModelController = {
  request: {},
  promise: {},
  helper: {}
};

// ---------------------------------------------------------------------------- //

ModelController.request.getModels = function (req, res) {
  ResponseHelper.handle(ModelController.promise.getModels, req, res, DEBUG_ENV);
};

ModelController.request.getModel = function (req, res) {
  ResponseHelper.handle(ModelController.promise.getModel, req, res, DEBUG_ENV);
};

ModelController.request.getLatestModels = function (req, res) {
  ResponseHelper.handle(ModelController.promise.getLatestModels, req, res, DEBUG_ENV);
};

ModelController.request.getTopModels = function (req, res) {
  ResponseHelper.handle(ModelController.promise.getTopModels, req, res, DEBUG_ENV);
};

ModelController.request.getBrowsePageModels = function (req, res) {
  ResponseHelper.handle(ModelController.promise.getBrowsePageModels, req, res, DEBUG_ENV);
};

ModelController.request.createModel = function (req, res) {
  ResponseHelper.handle(ModelController.promise.createModel, req, res, DEBUG_ENV);
};

ModelController.request.updateModelInfo = function (req, res) {
  ResponseHelper.handle(ModelController.promise.updateModelInfo, req, res, DEBUG_ENV);
};

ModelController.request.incrementViews = function (req, res) {
  ResponseHelper.handle(ModelController.promise.incrementViews, req, res, DEBUG_ENV);
};

ModelController.request.toggleFlag = function (req, res) {
  ResponseHelper.handle(ModelController.promise.toggleFlag, req, res, DEBUG_ENV);
};

ModelController.request.addSnapshots = function (req, res) {
  ResponseHelper.handle(ModelController.promise.addSnapshots, req, res, DEBUG_ENV);
};

ModelController.request.deleteSnapshot = function (req, res) {
  ResponseHelper.handle(ModelController.promise.deleteSnapshot, req, res, DEBUG_ENV);
};

ModelController.request.addStatisticsPoint = function (req, res) {
  ResponseHelper.handle(ModelController.promise.addStatisticsPoint, req, res, DEBUG_ENV);
};

ModelController.request.getTextureData = function (req, res) {
  ResponseHelper.handle(ModelController.promise.getTextureData, req, res, DEBUG_ENV);
};

ModelController.request.addWalkthrough = function (req, res) {
  ResponseHelper.handle(ModelController.promise.addWalkthrough, req, res, DEBUG_ENV);
};

ModelController.request.updateWalkthrough = function (req, res) {
  ResponseHelper.handle(ModelController.promise.updateWalkthrough, req, res, DEBUG_ENV);
};

ModelController.request.deleteWalkthrough = function (req, res) {
  ResponseHelper.handle(ModelController.promise.deleteWalkthrough, req, res, DEBUG_ENV);
};

ModelController.request.addStatisticsPoint = function (req, res) {
  ResponseHelper.handle(ModelController.promise.addStatisticsPoint, req, res, DEBUG_ENV);
};

// ---------------------------------------------------------------------------- //

ModelController.promise.getModel = function (req) {
  const { modelId } = req.params;
  return Model.getModelById(modelId, {}, { populate: 'uploader' });
};

ModelController.promise.getModels = function (req) {
  const { query, options } = req.query;
  return Model.getModels(query, options);
};

ModelController.promise.getTopModels = function () {
  return Model.getTopModels();
};

ModelController.promise.getLatestModels = function () {
  return Model.getLatestModels();
};

ModelController.promise.getBrowsePageModels = function (req) {
  if (req.query.searchString && !req.query.searchUser) {
    const payload = { ...req.query };
    return User.findByName(payload.searchString)
      .then(result => {
        payload.userIds = result;
        return Model.getBrowsePageModels(payload);
      });
  }
  return Model.getBrowsePageModels(req.query);
};

ModelController.promise.createModel = function (req) {
  const userId = req.user._id;
  const infoFields = ['title', 'category', 'description', 'tags'];
  const modelInfo = _.pick(req.body, infoFields);
  const filePaths = req.files.map(file => file.path);

  // Extract urls to be saved in Model document
  const urls = req.files
    .filter(file => file.fieldname === 'modelFiles')
    .map(file => file.path.replace(`${path.resolve(__dirname, '../../../storage/models')}/`, ''));
  const zipFilePath = path.resolve(__dirname, `../../../storage/models/${req.requestToken}/model.zip`);

  // Validate data error
  const error = User.validate({ _id: userId }, { _id: true })
    || Model.validate(modelInfo, { title: true })
    || Model.validateFilePaths(filePaths);
  if (error) {
    return Promise.reject(new ClientError(error));
  }

  return Promise.all([
    ModelController.helper.resizeTextures(req.files),
    ModelController.helper.extractMeta(filePaths),
    ModelController.helper.zipModel(req.files, zipFilePath)
  ])
    .then(res => {
      const metaData = res[1];
      return Model.createModel({
        ...modelInfo,
        uploader: userId,
        urls,
        zipUrl: `${req.requestToken}/model.zip`,
        metaData
      });
    });
};

ModelController.promise.updateModelInfo = function (req) {
  const fields = ['title', 'category', 'description', 'tags'];
  const { modelId } = req.params;
  const modelInfo = _.pick(req.body, fields);

  const error = User.validate(req.user, { _id: true })
    || Model.validate({ ...modelInfo, _id: modelId }, { _id: true, title: true });
  if (error) {
    return Promise.reject(new ClientError(error));
  }

  return Model.getModelById(modelId)
    .then(MongooseHelper.checkExists)
    .then(model => {
      if (!model.uploader === req.user._id) {
        return Promise.reject(new ClientError(Constants.ERROR_MODEL_NOT_OWNER));
      }
    })
    .then(() => Model.updateModelInfo(modelId, modelInfo));
};

ModelController.promise.incrementViews = function (req) {
  const { modelId } = req.params;

  const error = Model.validate({ _id: modelId }, { _id: true });
  if (error) {
    return Promise.reject(new ClientError(error));
  }

  return Model.incrementViews(modelId, 1);
};

ModelController.promise.toggleFlag = function (req) {
  const { modelId } = req.params;
  const { isFlagged } = req.body;
  const userId = req.user._id;

  const error = Model.validate({ _id: modelId }, { _id: true })
    || User.validate(req.user, { _id: true });
  if (error) {
    return Promise.reject(new ClientError(error));
  }

  if (isFlagged) {
    return Model.flagModel(modelId, userId);
  } else {
    return Model.unflagModel(modelId, userId);
  }
};

ModelController.promise.addSnapshots = function (req) {
  const { modelId } = req.params;
  // Extract urls to be saved in Model document
  const snapshotUrls = req.files
    .filter(file => file.fieldname === 'imageFiles')
    .map(file => file.path.replace(`${path.resolve(__dirname, '../../../storage/snapshots')}/`, ''));

  const error = User.validate(req.user, { _id: true })
    || Model.validate({ _id: modelId }, { _id: true });
  if (error) {
    return Promise.reject(new ClientError(error));
  }

  return Model.addSnapshots(modelId, snapshotUrls);
};

ModelController.promise.deleteSnapshot = function (req) {
  const { modelId } = req.params;
  const { index } = req.body;

  const error = User.validate(req.user, { _id: true })
    || Model.validate({ _id: modelId }, { _id: true });
  if (error) {
    return Promise.reject(new ClientError(error));
  }

  return Model.deleteSnapshot(modelId, index);
};

ModelController.promise.addWalkthrough = function (req) {
  const walkthrough = req.body;
  const { modelId } = req.params;
  const error = User.validate(req.user, { _id: true })
    || Model.validate({ _id: modelId }, { _id: true });
  if (error) {
    return Promise.reject(new ClientError(error));
  }

  return Model.addWalkthrough(modelId, walkthrough);
};

ModelController.promise.updateWalkthrough = function (req) {
  const { index, ...walkthrough } = req.body;
  const { modelId } = req.params;
  const error = User.validate(req.user, { _id: true })
    || Model.validate({ _id: modelId }, { _id: true });
  if (error) {
    return Promise.reject(new ClientError(error));
  }
  if (typeof walkthrough.disjointMode !== 'undefined') {
    walkthrough.animationMode = 'Stationary';
  }

  return Model.updateWalkthrough(modelId, index, walkthrough);
};

ModelController.promise.deleteWalkthrough = function (req) {
  const { index } = req.body;
  const { modelId } = req.params;
  const error = User.validate(req.user, { _id: true })
    || Model.validate({ _id: modelId }, { _id: true });
  if (error) {
    return Promise.reject(new ClientError(error));
  }

  return Model.deleteWalkthrough(modelId, index);
};

// ----------------------------------------------------------------------------//

ModelController.helper.zipModel = function (files, zipFilePath) {
  const zip = new JSZip();
  const modelFiles = files.filter(file => {
    return file.fieldname === 'modelFiles';
  });

  return Promise.all(
    modelFiles.map(file => {
      return new Promise((resolve, reject) => {
        fs.readFile(file.path, (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      })
        .then(fileData => {
          return zip.file(file.filename, fileData);
        });
    })
  )
    .then(() => {
      const buffer = zip.generate({ type: 'nodebuffer' });
      return new Promise((resolve, reject) => {
        fs.writeFile(zipFilePath, buffer, (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
};

ModelController.helper.resizeTextures = function (files) {
  const textureFiles = files.filter(file => {
    return file.fieldname === 'modelFiles' && StringHelper.isImagePath(file.path);
  });
  return Promise.all(
    _.flatten(
      textureFiles.map(file => {
        const ext = path.extname(file.path);
        return [
          TextureHelper.resize(4, file.path, file.path.replace(`${ext}`, `@2${ext}`)),
          TextureHelper.resize(9, file.path, file.path.replace(`${ext}`, `@3${ext}`)),
          TextureHelper.resize(16, file.path, file.path.replace(`${ext}`, `@4${ext}`))
        ];
      })
    )
  );
};

ModelController.helper.extractMeta = function (filePaths) {
  let promise;
  const objMetaPromise = ModelController.helper.getObjMeta(
    filePaths.filter(filePath => filePath.endsWith('.obj'))[0]
  );
  const mtlFiles = filePaths.filter(filePath => filePath.endsWith('.mtl'));
  const textureFiles = filePaths.filter(filePath => {
    return !filePath.endsWith('.mtl') && !filePath.endsWith('.obj');
  });
  if (mtlFiles.length === 0) {
    promise = objMetaPromise;
  } else {
    promise = Promise.all([
      objMetaPromise,
      ModelController.helper.getMtlMeta(mtlFiles[0], textureFiles)
    ]);
  }

  return promise
    .then(res => {
      if (Array.isArray(res)) {
        return res.reduce((m, e) => Object.assign(m, e), {});
      }

      return res;
    });
};

ModelController.helper.getObjMeta = function (objFile) {
  return ModelHelper.objVertexFaceCounter(objFile);
};

ModelController.helper.getMtlMeta = function (mtlFile, textureFiles) {
  const textureRelativeFiles = textureFiles.map(textureFile => {
    return textureFile.replace(`${path.dirname(mtlFile)}/`, '');
  });

  return ModelHelper.mtlTexturesAvailable(mtlFile, textureRelativeFiles)
    .then(metaData => {
      if (!metaData.hasRequiredTextures) {
        return Promise.reject(new ClientError(Constants.ERROR_MODEL_MTL_TEXTURE_MISSING));
      }
      if (metaData.hasRedundantTextures) {
        return Promise.reject(new ClientError(Constants.ERROR_MODEL_REDUNDANT_TEXTURES));
      }

      return {
        hasExternalTexture: textureFiles.length > 0
      };
    });
};

ModelController.promise.addStatisticsPoint = function (req) {
  const { modelId } = req.params;

  const error = Model.validate({ _id: modelId }, { _id: true });
  if (error) {
    return Promise.reject(new ClientError(error));
  }

  return Model.addStatisticsPoint(modelId, req.body.point);
};

ModelController.promise.getTextureData = function (req) {
  const { filePaths } = req.query;

  return ModelHelper.obtainTextureFilesData(
    path.resolve(__dirname, '../../../storage/models'),
    filePaths);
};

export default ModelController;
