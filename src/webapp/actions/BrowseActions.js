import {
  REQ_GET_BROWSE_RESULTS
} from './types';

export default {
  browse(query) {
    return {
      type: REQ_GET_BROWSE_RESULTS,
      promise: (apiClient) => apiClient.get('/browse', {
        query
      })
    };
  }
};
