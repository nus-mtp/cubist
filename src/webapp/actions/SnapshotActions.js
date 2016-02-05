import {
  SNAPSHOT_TRIGGER,
  SNAPSHOT_SUCCESS
} from './types';

export default {
  triggerSnapshot(token) {
    return {
      type: SNAPSHOT_TRIGGER,
      payload: token
    };
  },

  snapshotSuccess(token, data) {
    return {
      type: SNAPSHOT_SUCCESS,
      payload: {
        data,
        token
      }
    };
  }
};
