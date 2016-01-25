import {
  REQ_GET_MODEL
} from './types';

export default {
  getModel(id) {
    return {
      type: REQ_GET_MODEL,
      promise: (apiClient) => apiClient.get(`/model/${id}`)
    };
  }
};
