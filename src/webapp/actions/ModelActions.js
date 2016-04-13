import {
  REQ_GET_MODEL,
  REQ_GET_MODELS,
  REQ_GET_TOP_MODELS,
  REQ_GET_LATEST_MODELS,
  REQ_POST_CREATE_MODEL,
  REQ_PUT_UPDATE_MODEL_INFO,
  REQ_PUT_INCREMENT_MODEL_VIEWS,
  REQ_PUT_TOGGLE_MODEL_FLAG,
  REQ_PUT_ADD_MODEL_SNAPSHOTS,
  REQ_PUT_REMOVE_MODEL_SNAPSHOT,
  REQ_PUT_ADD_STATISTICS_POINT,
  REQ_DEL_MODEL
} from './types';

export default {
  getModels(query = {}, options = {}) {
    return {
      type: REQ_GET_MODELS,
      promise: apiClient => apiClient.get(`/model`, {
        query: {
          query,
          options
        }
      })
    };
  },

  getModel(id, query = {}, options = {}) {
    return {
      type: REQ_GET_MODEL,
      promise: (apiClient) => apiClient.get(`/model/${id}`, {
        query: {
          query,
          options
        }
      })
    };
  },

  getTopModels() {
    return {
      type: REQ_GET_TOP_MODELS,
      promise: apiClient => apiClient.get('/models/top')
    };
  },

  getLatestModels() {
    return {
      type: REQ_GET_LATEST_MODELS,
      promise: apiClient => apiClient.get('/models/latest')
    };
  },

  createModel(files, info) {
    return {
      type: REQ_POST_CREATE_MODEL,
      promise: (apiClient) => apiClient.post('/model', {
        attachments: files.map(file => {
          return {
            file,
            field: 'modelFiles'
          };
        }),
        fields: info
      })
    };
  },

  updateModelInfo(modelId, modelInfo) {
    return {
      type: REQ_PUT_UPDATE_MODEL_INFO,
      promise: apiClient => apiClient.put(`/model/${modelId}/info`, {
        body: {
          ...modelInfo
        }
      })
    };
  },

  incrementViews(modelId) {
    return {
      type: REQ_PUT_INCREMENT_MODEL_VIEWS,
      promise: apiClient => apiClient.put(`/model/${modelId}/views`)
    };
  },

  toggleFlag(modelId, isFlagged) {
    return {
      type: REQ_PUT_TOGGLE_MODEL_FLAG,
      promise: apiClient => apiClient.put(`/model/${modelId}/flag`, {
        body: {
          isFlagged
        }
      })
    };
  },

  addSnapshots(modelId, snapshots) {
    return {
      type: REQ_PUT_ADD_MODEL_SNAPSHOTS,
      promise: apiClient => apiClient.put(`/model/${modelId}/addSnapshots`, {
        attachments: snapshots.map(img => {
          return {
            file: img,
            field: 'imageFiles'
          };
        })
      })
    };
  },

  removeSnapshot(modelId, index) {
    return {
      type: REQ_PUT_REMOVE_MODEL_SNAPSHOT,
      promise: apiClient => apiClient.put(`/model/${modelId}/removeSnapshot`, {
        body: {
          index
        }
      })
    };
  },

  addStatisticsPoint(modelId, point) {
    return {
      type: REQ_PUT_ADD_STATISTICS_POINT,
      promise: apiClient => apiClient.put(`/model/${modelId}/addStatisticsPoint`, {
        body: {
          point
        }
      })
    };
  },

  deleteModel(modelId) {
    return {
      type: REQ_DEL_MODEL,
      promise: apiClient => apiClient.delete(`/model/${modelId}`),
      payload: modelId
    };
  }
};
