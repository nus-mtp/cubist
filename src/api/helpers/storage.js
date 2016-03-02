import mkdirp from 'mkdirp';
import path from 'path';
import multer from 'multer';

import { Logger } from 'common';

export default {
  getModelStorage() {
    return multer.diskStorage({
      destination(req, file, cb) {
        const dirPath = path.resolve(__dirname, `../../../storage/models/${req.requestToken}`);
        mkdirp(dirPath, err => {
          if (err) {
            Logger.error('Failed to create directory for model storage');
          }
          cb(null, dirPath);
        });
      },
      filename(req, file, cb) {
        cb(null, file.originalname);
      }
    });
  },
  getSnapshotStorage() {
    return multer.diskStorage({
      destination(req, file, cb) {
        const dirPath = path.resolve(__dirname, `../../../storage/snapshots/${req.requestToken}`);
        mkdirp(dirPath, err => {
          if (err) {
            Logger.error('Failed to create directory for snapshot storage');
          }
          cb(null, dirPath);
        });
      },
      filename(req, file, cb) {
        cb(null, file.originalname);
      }
    });
  }
};
