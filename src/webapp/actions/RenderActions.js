import {
  WIREFRAME_TOGGLE,
  SHADING_TOGGLE,
  AUTO_ROTATE_TOGGLE,
  RESET_VIEW_TOGGLE
} from './types';

export default {
  toggleWireframe: function() {
    return {
      type: WIREFRAME_TOGGLE
    };
  },

  toggleShading: function() {
    return {
      type: SHADING_TOGGLE
    };
  },

  toggleAutoRotate: function() {
    return {
      type: AUTO_ROTATE_TOGGLE
    };
  },

  toggleResetView: function() {
    return {
      type: RESET_VIEW_TOGGLE
    };
  }
};
