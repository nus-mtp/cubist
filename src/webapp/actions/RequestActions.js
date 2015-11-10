import {
  REDIRECT,
  REQUEST_FIRST_TIME
} from './types';

export default {
  redirect: function() {
    return {
      type: REDIRECT
    };
  },

  isRequestFirstTime: function() {
    return {
      type: REQUEST_FIRST_TIME
    };
  }
};
