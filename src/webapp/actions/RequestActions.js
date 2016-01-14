import {
  REDIRECT,
  REQUEST_FIRST_TIME
} from './types';

export default {
  redirect() {
    return {
      type: REDIRECT
    };
  },

  isRequestFirstTime() {
    return {
      type: REQUEST_FIRST_TIME
    };
  }
};
