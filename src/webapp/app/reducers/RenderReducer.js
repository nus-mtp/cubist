import Immutable from 'immutable';

import ReducerHelper from './ReducerHelper';
import {
  WIREFRAME_TOGGLE
} from 'webapp/app/actions/types';

const initialState = Immutable.fromJS({
  showWireframe: false
});

export default ReducerHelper.createReducer(initialState, {
  [WIREFRAME_TOGGLE]: (state) => {
    let nextState = state;
    nextState = nextState.set('showWireframe', !nextState.get('showWireframe'));

    return nextState;
  }
});
