import Promise from 'bluebird';
import _ from 'lodash';
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
ModelController.request.getModel = function (req, res) {
  ResponseHelper.handle(ModelController.promise.getModel, req, res, DEBUG_ENV);
};

ModelController.request.getLatestModels = function (req, res) {
  ResponseHelper.handle(ModelController.promise.getLatestModels, req, res, DEBUG_ENV);
};

ModelController.request.getTopModels = function (req, res) {
  ResponseHelper.handle(ModelController.promise.getTopModels, req, res, DEBUG_ENV);
};

ModelController.request.createModel = function (req, res) {
  ResponseHelper.handle(ModelController.promise.createModel, req, res, DEBUG_ENV);
};

ModelController.request.updateModelInfo = function (req, res) {
  ResponseHelper.handle(ModelController.promise.updateModelInfo, req, res, DEBUG_ENV);
};

ModelController.request.searchModels = function (req, res) {
  ResponseHelper.handle(ModelController.promise.searchModels, req, res, DEBUG_ENV);
};

// ---------------------------------------------------------------------------- //
ModelController.promise.getModel = function (req) {
  const { modelId } = req.params;
  return Model.getModelById(modelId, { populate: 'uploader' });
};

ModelController.promise.getTopModels = function () {
  return Model.getTopModels();
};

ModelController.promise.getLatestModels = function () {
  return Model.getLatestModels();
};

ModelController.promise.createModel = function (req) {
  const infoFields = ['title', 'category', 'description', 'tags'];
  const modelInfo = _.pick(req.body, infoFields);
  const filePaths = req.files.map(file => file.path);
  const urls = req.files
    .filter(file => file.fieldname === 'modelFiles')
    .map(file => file.path.replace(`${path.resolve(__dirname, '../../../models')}/`, ''));
  const userId = req.user._id;

  const error = User.validate({ _id: userId }, { _id: true })
    || Model.validate(modelInfo, { title: true })
    || Model.validateFilePaths(filePaths);
  if (error) {
    return Promise.reject(new ClientError(error));
  }

  return ModelController.helper.resizeTextures(req.files)
    .then(() => {
      const objMetaPromise = ModelController.helper.getObjMeta(
        filePaths.filter(filePath => filePath.endsWith('.obj'))[0]
      );
      const mtlFiles = filePaths.filter(filePath => filePath.endsWith('.mtl'));
      const textureFiles = filePaths.filter(filePath => {
        return !filePath.endsWith('.mtl') && !filePath.endsWith('.obj');
      });
      if (mtlFiles.length === 0) {
        return objMetaPromise;
      }

      return Promise.all([
        objMetaPromise,
        ModelController.helper.getMtlMeta(mtlFiles[0], textureFiles)
      ]);
    })
    .then(res => {
      if (Array.isArray(res)) {
        return res.reduce((m, e) => Object.assign(m, e), {});
      }

      return res;
    })
    .then(metaData => {
      return Model.createModel({
        ...modelInfo,
        uploader: userId,
        urls,
        metaData
      });
    });
};

ModelController.promise.updateModelInfo = function (req) {
  const fields = ['title', 'category', 'description', 'tags'];
  const { modelId } = req.params;
  const modelInfo = _.pick(req.body, fields);

  const error = User.validate(req.user, { _id: true })
    || Model.validate(modelInfo, { title: true });
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

ModelController.helper.resizeTextures = function (files) {
  return Promise.all(
    files
      .filter(file => file.fieldname === 'modelFiles' && StringHelper.isImagePath(file.path))
      .map(file => {
        const ext = path.extname(file.path);
        return TextureHelper.resize(2, file.path, file.path.replace(`${ext}`, `@2${ext}`));
      })
  );
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

ModelController.promise.searchModels = function (req) {
  return Model.searchModels(req.query.searchString);
};

export default ModelController;
