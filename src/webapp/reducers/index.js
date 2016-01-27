import { routerStateReducer } from 'redux-router';

import RequestStore from './RequestReducer';
import ServerStore from './ServerReducer';
import RenderStore from './RenderReducer';
import CameraStore from './CameraReducer';
import WalkthroughStore from './WalkthroughReducer';
import ModelStore from './ModelReducer';
import UserStore from './UserReducer';

// Define list of Redux stores
export default {
  router: routerStateReducer,
  RequestStore,
  RenderStore,
  ServerStore,
  CameraStore,
  WalkthroughStore,
  ModelStore,
  UserStore
};
