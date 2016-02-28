import {
  REQ_GET_SEARCH_RESULTS
} from './types';

export default {
  search(searchString) {
    return {
      type: REQ_GET_SEARCH_RESULTS,
      promise: (apiClient) => apiClient.get('/search', {
        query: {
          searchString
        }
      })
    };
  }
};
