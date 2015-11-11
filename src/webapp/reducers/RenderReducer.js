import Immutable from 'immutable';

import ReducerHelper from './ReducerHelper';
import {
  WIREFRAME_TOGGLE,
  SHADING_TOGGLE,
  AUTO_ROTATE_TOGGLE
} from 'webapp/actions/types';

const initialState = Immutable.fromJS({
  wireframe: false,
  shadingMode: 0,
  autoRotate: false
});

export default ReducerHelper.createReducer(initialState, {
  [WIREFRAME_TOGGLE]: (state) => {
    let nextState = state;
    nextState = nextState.set('wireframe', !nextState.get('wireframe'));

    return nextState;
  },

  [SHADING_TOGGLE]: (state) => {
    let nextState = state;
    nextState = nextState.set('shadingMode', (nextState.get('shadingMode') + 1) % 3);

    return nextState;
  },

  [AUTO_ROTATE_TOGGLE]: (state) => {
    let nextState = state;
    nextState = nextState.set('autoRotate', !nextState.get('autoRotate'));

    return nextState;
  }
});
