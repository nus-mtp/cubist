import mongoose, { Schema } from 'mongoose';
import _ from 'lodash';
import Promise from 'bluebird';

import { MongooseHelper } from 'api/helpers';
import { Constants } from 'common';

const ObjectId = Schema.Types.ObjectId;

const Model = new Schema({
  title: { type: String, required: true, trim: true, index: true },
  category: { type: String, required: true, default: 'misc', index: true },
  description: { type: String, trim: true, default: '' },
  tags: [{ type: String, trim: true }],
  uploader: { type: ObjectId, ref: 'User', required: true, index: true },
  urls: [{ type: String }],
  zipUrl: { type: String },
  socialData: {
    views: { type: Number, default: 0 },
    favorites: [{ type: ObjectId, ref: 'User', index: true }],
    flags: [{ type: ObjectId, ref: 'User', index: true }]
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

// -----------------------------------------------------
// -----------------MODEL VALIDATION--------------------
// -----------------------------------------------------

Model.statics.validate = function (model, fields) {
  if (fields._id) {
    if (!model._id) {
      return Constants.ERROR_MODEL_ID_REQUIRED;
    }

    if (!_.isString(model._id) || model._id.trim().length === 0) {
      return Constants.ERROR_MOEDL_ID_INVALID;
    }
  }

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

// -----------------------------------------------------
// -----------------MODEL QUERY-------------------------
// -----------------------------------------------------

Model.statics.getModels = function (query = {}, options = {}) {
  return MongooseHelper.find(this, query, options);
};

Model.statics.getModelById = function (modelId, query = {}, options = {}) {
  return MongooseHelper.findOne(this, { ...query, _id: modelId }, options);
};

Model.statics.getLatestModels = function () {
  return MongooseHelper.find(
    this,
    {},
    {
      limit: 20,
      sort: '-updatedAt',
      populate: 'uploader'
    }
  );
};

Model.statics.getTopModels = function () {
  return MongooseHelper.find(
    this,
    {},
    {
      limit: 9,
      sort: '-socialData.views',
      populate: 'uploader'
    }
  );
};

Model.statics.getBrowsePageModels = function (urlQuery) {
  let query = {};
  const options = {
    limit: 21,
    populate: 'uploader',
    sort: '-updatedAt'
  };

  if (urlQuery.searchString) {
    const searchWords = urlQuery.searchString.split(/[ ,]+/);
    const regExp = new RegExp('(' + searchWords.join('|') + ')', 'i');

    let noOfFields = 3;
    if (urlQuery.searchTitle !== undefined) {
      noOfFields--;
    }
    if (urlQuery.searchTag !== undefined) {
      noOfFields--;
    }
    if (urlQuery.searchUser !== undefined) {
      noOfFields--;
    }
    if (noOfFields === 1) {
      if (!urlQuery.searchTitle) {
        query.title = regExp;
      }
      if (!urlQuery.searchTag) {
        query.tags = regExp;
      }
      if (!urlQuery.searchUser) {
        query.uploader = { $in: urlQuery.userIds };
      }
    } else if (noOfFields > 1) {
      const queryArr = [];
      if (!urlQuery.searchTitle) {
        queryArr.push({ title: regExp });
      }
      if (!urlQuery.searchTag) {
        queryArr.push({ tags: regExp });
      }
      if (!urlQuery.searchUser) {
        queryArr.push({ uploader: { $in: urlQuery.userIds } });
      }
      query = { $or: queryArr };
    } else {
      // No fields specified, return empty array
      return Promise.resolve([]);
    }
  }

  if (urlQuery.category && urlQuery.category !== 'all') {
    for (let i = 0; i < Constants.MODEL_CATEGORIES.length; i++) {
      if (Constants.MODEL_CATEGORIES[i].toLowerCase() === urlQuery.category.toLowerCase()) {
        query.category = new RegExp(urlQuery.category, 'i');
      }
    }
  }

  if (urlQuery.sort === '1') {
    options.sort = '-socialData.views';
  }

  if (urlQuery.sort === '2') {
    options.sort = 'title';
  }

  if (urlQuery.page && urlQuery.page !== '1') {
    const parsedInt = parseInt(urlQuery.page, 10);
    if (!isNaN(parsedInt) && parsedInt > 1) {
      options.skip = (parsedInt - 1) * 20;
    }
  }

  return MongooseHelper.find(this, query, options);
};

// -----------------------------------------------------
// -----------------MODEL CREATION----------------------
// -----------------------------------------------------

Model.statics.createModel = function (model) {
  const fields = [
    'title',
    'category',
    'description',
    'tags',
    'socialData',
    'metaData',
    'uploader',
    'zipUrl',
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

Model.statics.updateModelInfo = function (modelId, info) {
  const fields = ['title', 'category', 'description', 'tags'];
  const modelInfo = _.pick(info, fields);
  // Split tags into array
  if (modelInfo.tags) {
    modelInfo.tags = modelInfo.tags.split(',').map(tag => tag.trim());
  }

  return MongooseHelper.findOneAndUpdate(this, { _id: modelId }, info, { new: true }, { populate: 'uploader' });
};

// -----------------------------------------------------
// -----------------MODEL SOCIAL DATA-------------------
// -----------------------------------------------------

Model.statics.flagModel = function (modelId, userId) {
  const condition = {
    _id: modelId
  };
  const update = {
    $addToSet: {
      'socialData.flags': userId
    }
  };

  return MongooseHelper.findOneAndUpdate(this, condition, update, { new: true }, { populate: 'uploader' });
};

Model.statics.unflagModel = function (modelId, userId) {
  const condition = {
    _id: modelId
  };
  const update = {
    $pull: {
      'socialData.flags': userId
    }
  };

  return MongooseHelper.findOneAndUpdate(this, condition, update, { new: true }, { populate: 'uploader' });
};

Model.statics.incrementViews = function (modelId, amount) {
  const condition = {
    _id: modelId
  };
  const update = {
    $inc: {
      'socialData.views': amount
    }
  };

  return MongooseHelper.update(this, condition, update);
};

// -----------------------------------------------------
// -----------------MODEL SNAPSHOTS---------------------
// -----------------------------------------------------

Model.statics.addSnapshots = function (modelId, snapshotUrls) {
  const condition = {
    _id: modelId
  };
  const update = {
    $push: {
      imageUrls: {
        $each: snapshotUrls
      }
    }
  };

  return MongooseHelper.findOneAndUpdate(this, condition, update, { new: true });
};

Model.statics.deleteSnapshot = function (modelId, index) {
  const condition = {
    _id: modelId
  };
  const unsetUpdate = {
    $unset: {
      [`imageUrls.${index}`]: 1
    }
  };
  const pullUpdate = {
    $pull: {
      imageUrls: null
    }
  };

  return MongooseHelper.findOneAndUpdate(this, condition, unsetUpdate)
    .then(() => MongooseHelper.findOneAndUpdate(this, condition, pullUpdate, { new: true }));
};

export default mongoose.model('Model', Model, 'Model');
