import {
  ADD_POINT,
  UPDATE_POINT,
  DELETE_POINT,
  TOGGLE_DISJOINT
} from './types';

export default {
  addPoint() {
    return {
      type: ADD_POINT
    };
  },

  updatePoint(index, coordinate) {
    return {
      type: UPDATE_POINT,
      payload: {
        index,
        posX: coordinate[0],
        posY: coordinate[1],
        posZ: coordinate[2]
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
  }

};
