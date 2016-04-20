import {
  CAMERA_ORBIT,
  CAMERA_UPDATE,
  CAMERA_SET_VIEW
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
  },

  setCameraView(position, lookAt) {
    return {
      type: CAMERA_SET_VIEW,
      payload: {
        position,
        lookAt
      }
    };
  }

};
