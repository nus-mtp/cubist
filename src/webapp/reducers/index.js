import { routerStateReducer } from 'redux-router';

import RequestStore from './RequestReducer';
import ServerStore from './ServerReducer';
import RenderStore from './RenderReducer';
import CameraStore from './CameraReducer';
import WalkthroughStore from './WalkthroughReducer';
import ModelStore from './ModelReducer';
import UserStore from './UserReducer';
import SnapshotStore from './SnapshotReducer';
import BrowseStore from './BrowseReducer';
import TextureLoadStore from './TextureLoadReducer';

// Define list of Redux stores
export default {
  router: routerStateReducer,
  RequestStore,
  RenderStore,
  ServerStore,
  CameraStore,
  WalkthroughStore,
  ModelStore,
  UserStore,
  SnapshotStore,
  BrowseStore,
  TextureLoadStore
};
