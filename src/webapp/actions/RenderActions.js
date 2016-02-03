import {
  WIREFRAME_TOGGLE,
  SHADING_TOGGLE,
  AUTO_ROTATE_TOGGLE,
  RESET_VIEW_TOGGLE,
  PLAY_WALKTHROUGH
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
  },

  toggleResetView() {
    return {
      type: RESET_VIEW_TOGGLE
    };
  },

  togglePlaybackWalkthrough() {
    return {
      type: PLAY_WALKTHROUGH
    };
  }
};
