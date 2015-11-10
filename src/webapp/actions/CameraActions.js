import {
  CAMERA_PAN,
  CAMERA_ROTATE,
  CAMERA_ZOOM
} from './types';

export default {
  pan: function() {
    return {
      type: CAMERA_PAN
    };
  },

  rotate: function() {
    return {
      type: CAMERA_ROTATE
    };
  },

  zoom: function() {
    return {
      type: CAMERA_ZOOM
    };
  }
};
