import mongoose, { Schema } from 'mongoose';
import _ from 'lodash';

import { MongooseHelper } from 'api/helpers';
import { Constants } from 'common';

const ObjectId = Schema.Types.ObjectId;

const Model = new Schema({
  title: { type: String, required: true, trim: true, index: true },
  category: { type: String, required: true, default: 'Misc', index: true },
  description: { type: String, trim: true, default: '' },
  tags: [{ type: String, trim: true }],
  uploader: { type: ObjectId, ref: 'User', required: true, index: true },
  urls: [{ type: String }],
  socialData: {
    favorites: { type: Number, default: 0 }
  },
  metaData: {
    vertices: { type: Number, default: 0 },
    faces: { type: Number, default: 0 },
    hasExternalTexture: { type: Boolean, default: false }
  },
  imageUrls: [{ type: String }],
  createdAt: { type: Date, index: true, default: Date.now },
  updatedAt: { type: Date, index: true, default: Date.now }
});

Model.statics.validate = function (model, fields) {
  if (fields.title) {
    if (!model.title) {
      return Constants.ERROR_MODEL_TITLE_REQUIRED;
    }
    if (model.title.trim().length < Constants.MODEL_TITLE_MIN_LENGTH) {
      return Constants.ERROR_MODEL_TITLE_MIN_LENGTH;
    }
    if (model.title.trim().length > Constants.MODEL_TITLE_MAX_LENGTH) {
      return Constants.ERROR_MODEL_TITLE_MAX_LENGTH;
    }
  }

  return null;
};

Model.statics.validateFilePaths = function (filePaths) {
  const objFiles = filePaths.filter(filePath => filePath.endsWith('.obj'));
  const mtlFiles = filePaths.filter(filePath => filePath.endsWith('.mtl'));
  const textureFiles = filePaths.filter(filePath => {
    return !filePath.endsWith('.obj') && !filePath.endsWith('.mtl');
  });
  if (objFiles.length > 1) {
    return Constants.ERROR_MODEL_OBJ_FILE_NOT_UNIQUE;
  }
  if (mtlFiles.length > 1) {
    return Constants.ERROR_MODEL_MTL_FILE_NOT_UNIQUE;
  }
  if (mtlFiles.length === 0 && textureFiles.length > 0) {
    return Constants.ERROR_MODEL_REDUNDANT_TEXTURES;
  }

  return null;
};

Model.statics.getModelById = function (modelId) {
  return MongooseHelper.findOne(this, { _id: modelId });
};

Model.statics.getLatestModels = function () {
  return MongooseHelper.find(
    this,
    {},
    {
      limit: 20,
      sort: '-updatedAt'
    }
  );
};

Model.statics.getTopModels = function () {
  return MongooseHelper.find(
    this,
    {},
    {
      limit: 9,
      sort: '-socialData.favorites',
      populate: 'uploader'
    }
  );
};

Model.statics.createModel = function (model) {
  const fields = [
    'title',
    'category',
    'description',
    'tags',
    'socialData',
    'metaData',
    'uploader',
    'urls',
    'imageUrls'
  ];
  const modelInfo = _.pick(model, fields);
  // Split tags into array
  if (modelInfo.tags) {
    modelInfo.tags = modelInfo.tags.split(',').map(tag => tag.trim());
  }

  return MongooseHelper.create(this, modelInfo);
};

export default mongoose.model('Model', Model, 'Model');
