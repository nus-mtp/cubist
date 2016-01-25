import { routerStateReducer } from 'redux-router';

import RequestStore from './RequestReducer';
import ServerStore from './ServerReducer';
import RenderStore from './RenderReducer';
import CameraStore from './CameraReducer';
import ModelStore from './ModelReducer';

// Define list of Redux stores
export default {
  router: routerStateReducer,
  RequestStore,
  RenderStore,
  ServerStore,
  CameraStore,
  ModelStore
};
