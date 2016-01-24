import mongoose, { Schema } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

const Model = new Schema({
  title: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  description: { type: String, trim: true, default: '' },
  uploader: { type: ObjectId, ref: '_User', required: true, index: true },
  urls: [{ type: String }],
  imageUrls: [{ type: String }],
  createdAt: { type: Date, index: true, default: Date.now },
  updatedAt: { type: Date, index: true, default: Date.now }
});

export default mongoose.model('Model', Model, 'Model');
