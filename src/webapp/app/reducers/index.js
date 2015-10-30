import {routerStateReducer} from 'redux-router';

import RequestStore from './RequestReducer';
import RenderStore from './RenderReducer';

// Define list of Redux stores
export default {
  router: routerStateReducer,
  RequestStore,
  RenderStore
};
