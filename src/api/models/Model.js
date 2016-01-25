import mongoose, { Schema } from 'mongoose';
import _ from 'lodash';

import { MongooseHelper } from 'api/helpers';

const ObjectId = Schema.Types.ObjectId;

const Model = new Schema({
  title: { type: String, required: true, index: true },
  category: { type: String, required: true, default: 'Misc', index: true },
  description: { type: String, trim: true, default: '' },
  uploader: { type: ObjectId, ref: '_User', required: true, index: true },
  urls: [{ type: String }],
  imageUrls: [{ type: String }],
  createdAt: { type: Date, index: true, default: Date.now },
  updatedAt: { type: Date, index: true, default: Date.now }
});

Model.statics.createModel = function (model) {
  return MongooseHelper.create(this, _.pick(model, [
    'title', 'uploader', 'urls', 'imageUrls'
  ]));
};

export default mongoose.model('Model', Model, 'Model');
