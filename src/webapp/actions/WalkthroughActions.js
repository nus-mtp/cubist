import {
  ADD_POINT,
  UPDATE_POINT,
  DELETE_POINT,
  TOGGLE_DISJOINT,
  UPDATE_ANIMATION,
  UPDATE_DURATION
} from './types';

export default {
  addPoint() {
    return {
      type: ADD_POINT
    };
  },

  updatePoint(index, pos, snapshotToken) {
    return {
      type: UPDATE_POINT,
      payload: {
        index,
        pos,
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
  }
};
