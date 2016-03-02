import Immutable from 'immutable';

import ReducerHelper from './ReducerHelper';
import {
  CAMERA_ORBIT
} from 'webapp/actions/types';

// Take note that each element in the list is Vector3
const initialState = Immutable.fromJS({
  position: new Immutable.Map({ x: 0, y: 450, z: 450 }),
  up: new Immutable.Map({ x: 0, y: 1, z: 0 }),
  lookAt: new Immutable.Map({ x: 0, y: 0, z: 0 }),
  quaternion: new Immutable.Map({ x:0, y: 0, z: 0, w: 0})
});

export default ReducerHelper.createReducer(initialState, {
  [CAMERA_ORBIT](state, action) {
    let nextState = state;
    nextState = nextState.merge(Immutable.fromJS(action.payload));
    return nextState;
  }
});
