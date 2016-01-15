import {
  REDIRECT_SERVER,
  FIRST_TIME
} from './types';

export default {
  redirect: (path) => {
    return {
      type: REDIRECT_SERVER,
      redirect: path
    };
  },

  firstTime: () => {
    return {
      type: FIRST_TIME
    };
  }
};
