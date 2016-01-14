import {
  WIREFRAME_TOGGLE,
  SHADING_TOGGLE,
  AUTO_ROTATE_TOGGLE
} from './types';

export default {
  toggleWireframe() {
    return {
      type: WIREFRAME_TOGGLE
    };
  },

  toggleShading() {
    return {
      type: SHADING_TOGGLE
    };
  },

  toggleAutoRotate() {
    return {
      type: AUTO_ROTATE_TOGGLE
    };
  }
};
