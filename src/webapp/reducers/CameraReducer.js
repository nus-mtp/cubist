import Immutable from 'immutable';

import ReducerHelper from './ReducerHelper';
import {
  CAMERA_ORBIT
} from 'webapp/actions/types';

// Take note that each element in the list is Vector3
const initialState = Immutable.fromJS({
  position: new Immutable.Map(),
  up: new Immutable.Map(),
  lookAt: new Immutable.Map()
});

export default ReducerHelper.createReducer(initialState, {
  [CAMERA_ORBIT](state, action) {
    let nextState = state;
    nextState = nextState.merge(Immutable.fromJS(action.payload));
    return nextState;
  }
});
