import {
  WIREFRAME_TOGGLE,
  SHADING_TOGGLE
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
  }
};
