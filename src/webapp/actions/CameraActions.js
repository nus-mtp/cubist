import {
  CAMERA_ORBIT,
  CAMERA_UPDATE
} from './types';

export default {
  orbitCamera(camera) {
    return {
      type: CAMERA_ORBIT,
      payload: camera
    };
  },

  updateCamera(camera) {
    return {
      type: CAMERA_UPDATE,
      payload: camera
    };
  }
};
