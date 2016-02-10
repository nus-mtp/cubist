import mkdirp from 'mkdirp';
import path from 'path';
import multer from 'multer';

import { Logger } from 'common';

export default {
  getModelStorage() {
    return multer.diskStorage({
      destination(req, file, cb) {
        const dirPath = path.resolve(__dirname, `../../../models/${req.requestToken}`);
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
  }
};
