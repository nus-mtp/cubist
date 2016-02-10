import {
  REQ_GET_MODEL,
  REQ_GET_TOP_MODELS,
  REQ_GET_LATEST_MODELS,

  REQ_POST_CREATE_MODEL,

  REQ_PUT_UPDATE_MODEL_INFO
} from './types';

export default {
  getModel(id) {
    return {
      type: REQ_GET_MODEL,
      promise: (apiClient) => apiClient.get(`/model/${id}`)
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
  }
};
