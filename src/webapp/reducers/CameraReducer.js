import Immutable from 'immutable';

import ReducerHelper from './ReducerHelper';
import {
  CAMERA_PAN,
  CAMERA_ROTATE,
  CAMERA_ZOOM
} from 'webapp/actions/types';

const initialState = Immutable.fromJS({
  posX: 0,
  posY: 0,
  posZ: 300,
  lookX: 0,
  lookY: 0,
  lookZ: 0
});

export default ReducerHelper.createReducer(initialState, {
  [CAMERA_PAN]() {

  },

  [CAMERA_ROTATE]() {

  },

  [CAMERA_ZOOM]() {

  }
});
