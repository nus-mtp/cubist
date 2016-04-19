import {
  WIREFRAME_TOGGLE,
  SHADING_TOGGLE,
  AUTO_ROTATE_TOGGLE,
  RESET_VIEW_TOGGLE,
  PLAY_WALKTHROUGH,
  TEXTURE_TOGGLE,
  RESET_BUTTONS
} from './types';

export default {
  resetButtons() {
    return {
      type: RESET_BUTTONS
    };
  },

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
  },

  toggleTexture() {
    return {
      type: TEXTURE_TOGGLE
    };
  }
};
