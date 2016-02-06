import {
  REQ_GET_MODEL,
  REQ_POST_CREATE_MODEL
} from './types';

export default {
  getModel(id) {
    return {
      type: REQ_GET_MODEL,
      promise: (apiClient) => apiClient.get(`/model/${id}`)
    };
  },

  createModel(files, info) {
    return {
      type: REQ_POST_CREATE_MODEL,
      promise: (apiClient) => apiClient.post(`/model`, {
        attachments: files.map(file => {
          return {
            file,
            field: 'modelFiles'
          };
        }),
        fields: info
      })
    };
  }
};
