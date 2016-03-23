import {
  LOAD_SMALL,
  LOAD_ORIG
} from './types';

export default {
  loadOrig(key, data) {
    return {
      type: LOAD_ORIG,
      payload: {
        key,
        data
      }
    };
  },

  loadSmall(key, data) {
    return {
      type: LOAD_SMALL,
      payload: {
        key,
        data
      }
    };
  }
};
