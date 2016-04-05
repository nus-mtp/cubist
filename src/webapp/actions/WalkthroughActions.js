import {
  ADD_POINT,
  UPDATE_POINT,
  DELETE_POINT,
  TOGGLE_DISJOINT,
  UPDATE_ANIMATION,
  UPDATE_DURATION,
  PLAYBACK_WALKTHROUGH,
  SET_PLAYBACK_START,
  SET_PLAYBACK_END,
  VIEW_WALKTHROUGH_POINT,
  INSERT_POINT
} from './types';

export default {
  addPoint() {
    return {
      type: ADD_POINT
    };
  },

  updatePoint(index, pos, lookAt, quaternion, snapshotToken) {
    return {
      type: UPDATE_POINT,
      payload: {
        index,
        pos,
        lookAt,
        quaternion,
        snapshotToken
      }
    };
  },

  deletePoint(index) {
    return {
      type: DELETE_POINT,
      payload: {
        index
      }
    };
  },

  toggleDisjointMode(index) {
    return {
      type: TOGGLE_DISJOINT,
      payload: {
        index
      }
    };
  },

  updateAnimationMode(index, animationMode) {
    return {
      type: UPDATE_ANIMATION,
      payload: {
        index,
        animationMode
      }
    };
  },

  updateAnimationDuration(index, duration) {
    return {
      type: UPDATE_DURATION,
      payload: {
        index,
        duration
      }
    };
  },

  playbackWalkthrough() {
    return {
      type: PLAYBACK_WALKTHROUGH
    };
  },

  setPlaybackStart(startIndex) {
    return {
      type: SET_PLAYBACK_START,
      payload: {
        startIndex
      }
    };
  },

  setPlaybackEnd(endIndex) {
    return {
      type: SET_PLAYBACK_END,
      payload: {
        endIndex
      }
    };
  },

  viewWalkthroughPoint(index) {
    return {
      type: VIEW_WALKTHROUGH_POINT,
      payload: {
        index
      }
    };
  },

  insertWalkthroughPoint(index, controlToggle, pos, lookAt, snapshot) {
    return {
      type: INSERT_POINT,
      payload: {
        index,
        controlToggle,
        pos,
        lookAt,
        snapshot
      }
    };
  }

};
