import {
  REQ_PUT_ADD_WALKTHROUGH,
  REQ_PUT_UPDATE_WALKTHROUGH,
  REQ_PUT_DELETE_WALKTHROUGH,
  PLAYBACK_WALKTHROUGH,
  SET_PLAYBACK_START,
  SET_PLAYBACK_END,
  VIEW_WALKTHROUGH_POINT,
  INSERT_POINT
} from './types';

export default {
  addWalkthrough(modelId, walkthrough, index, isBefore) {
    return {
      type: REQ_PUT_ADD_WALKTHROUGH,
      promise: apiClient => apiClient.put(`/model/${modelId}/addWalkthrough`, {
        body: {
          walkthrough,
          index,
          isBefore
        }
      })
    };
  },

  updateWalkthrough(modelId, index, update) {
    return {
      type: REQ_PUT_UPDATE_WALKTHROUGH,
      promise: apiClient => apiClient.put(`/model/${modelId}/updateWalkthrough`, {
        body: {
          index,
          ...update
        }
      }),
      payload: {
        index
      }
    };
  },

  deleteWalkthrough(modelId, index) {
    return {
      type: REQ_PUT_DELETE_WALKTHROUGH,
      promise: apiClient => apiClient.put(`/model/${modelId}/deleteWalkthrough`, {
        body: {
          index
        }
      }),
      payload: {
        index
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
