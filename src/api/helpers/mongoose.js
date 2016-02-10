import Promise from 'bluebird';
import mongoose from 'mongoose';

import { Constants, ClientError } from 'common';

export default {
  isObjectId: (str) => {
    return mongoose.Types.ObjectId.isValid(str);
  },

  checkExists: (obj, errorMessage = Constants.ERROR_MONGOOSE_DID_NOT_EXIST) => {
    return new Promise((resolve, reject) => {
      if (obj) {
        resolve(obj);
      } else {
        reject(new ClientError(errorMessage));
      }
    });
  },

  checkNil: (obj, errorMessage = Constants.ERROR_MONGOOSE_DID_EXIST) => {
    return new Promise((resolve, reject) => {
      if (!obj) {
        resolve();
      } else {
        reject(new ClientError(errorMessage));
      }
    });
  },

  checkEmpty: (count) => {
    return new Promise((resolve, reject) => {
      if (count === 0) {
        resolve();
      } else {
        reject();
      }
    });
  },

  checkNotEmpty: (count, errorMessage = Constants.ERROR_MONGOOSE_DID_NOT_EXIST) => {
    return new Promise((resolve, reject) => {
      if (count > 0) {
        resolve();
      } else {
        reject(new ClientError(errorMessage));
      }
    });
  },

  toObject: (obj, errorMessage = Constants.ERROR_NOT_MONGOOSE_OBJECT) => {
    return new Promise((resolve, reject) => {
      if (obj.toObject) {
        resolve(obj.toObject());
      } else {
        reject(new ClientError(errorMessage));
      }
    });
  },

  create: (Schema, data) => {
    return new Promise((resolve, reject) => {
      Schema.create(data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  findOne: (Schema, query, options = {}) => {
    const request = Schema.findOne(query);
    if (options.populate) {
      request.populate(options.populate);
    }
    if (options.select) {
      request.select(options.select);
    }
    if (options.lean) {
      request.lean();
    }

    return Promise.resolve(request.exec());
  },

  find: (Schema, query, options = {}) => {
    const request = Schema.find(query);
    if (options.populate) {
      request.populate(options.populate);
    }
    if (options.select) {
      request.select(options.select);
    }
    if (options.lean) {
      request.lean();
    }
    if (options.limit) {
      request.limit(options.limit);
    }
    if (options.sort) {
      request.sort(options.sort);
    }

    return Promise.resolve(request.exec());
  },

  findOneAndUpdate: (Schema, query, update, updateOptions = {}, options = {}) => {
    const request = Schema.findOneAndUpdate(query, update, updateOptions);
    if (options.populate) {
      request.populate(options.populate);
    }
    if (options.select) {
      request.select(options.select);
    }
    if (options.lean) {
      request.lean();
    }
    if (options.limit) {
      request.limit(options.limit);
    }
    if (options.sort) {
      request.sort(options.sort);
    }

    return Promise.resolve(request.exec());
  },

  batchCreate: (Schema, docs) => {
    const versionedDocs = docs.map((doc) => {
      if (!doc.__v) {
        doc.__v = 0;
      }

      return doc;
    });
    return new Promise((resolve, reject) => {
      Schema.collection.insert(versionedDocs, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },

  batchUpsert: (Schema, docs) => {
    return new Promise((resolve, reject) => {
      const bulk = Schema.collection.initializeUnorderedBulkOp();
      docs.forEach((doc) => {
        bulk.find(doc.query).upsert.updateOne(doc.data);
      });
      bulk.execute((err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },

  batchUpdate: (Schema, updateOps, isOrdered = false) => {
    return new Promise((resolve, reject) => {
      if (updateOps.length === 0) {
        return resolve();
      }

      let bulk;
      if (isOrdered) {
        bulk = Schema.collection.initializeOrderedBulkOp();
      } else {
        bulk = Schema.collection.initializeUnorderedBulkOp();
      }

      updateOps.forEach((updateOp) => {
        bulk.find(updateOp.query).updateOne(updateOp.update);
      });
      bulk.execute((err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }
};
