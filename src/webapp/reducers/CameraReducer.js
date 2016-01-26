import Immutable from 'immutable';

import ReducerHelper from './ReducerHelper';
import {
  CAMERA_ORBIT
} from 'webapp/actions/types';

const initialState = Immutable.fromJS({
  position: new Immutable.List(),
  up: new Immutable.List(),
  lookAt: new Immutable.List(),
  zoom: 1
});

export default ReducerHelper.createReducer(initialState, {
  [CAMERA_ORBIT](state, action) {
    let nextState = state;
    nextState = nextState.merge(Immutable.fromJS(action.payload));
    return nextState;
  }
});
