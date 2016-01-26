import {
  CAMERA_ORBIT
} from './types';

export default {
  orbitCamera(camera) {
    return {
      type: CAMERA_ORBIT,
      payload: camera
    };
  }
};
