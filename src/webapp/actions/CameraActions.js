import {
  CAMERA_PAN,
  CAMERA_ROTATE,
  CAMERA_ZOOM
} from './types';

export default {
  pan() {
    return {
      type: CAMERA_PAN
    };
  },

  rotate() {
    return {
      type: CAMERA_ROTATE
    };
  },

  zoom() {
    return {
      type: CAMERA_ZOOM
    };
  }
};
