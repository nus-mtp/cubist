import {routerStateReducer} from 'redux-router';

import RequestStore from './RequestReducer';

// Define list of Redux stores
export default {
  router: routerStateReducer,
  RequestStore
};
