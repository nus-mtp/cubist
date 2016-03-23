import Immutable from 'immutable';

import ReducerHelper from './ReducerHelper';
import {
  LOAD_SMALL,
  LOAD_ORIG
} from 'webapp/actions/types';

const initialState = Immutable.fromJS({
  key: undefined,
  smallTexture: new Immutable.Map(),
  origTexture: new Immutable.Map()
});

export default ReducerHelper.createReducer(initialState, {
  [LOAD_SMALL]: function (state, { payload }) {
    const { key, data } = payload;
    let nextState = state;
    nextState = nextState.set('key', key);
    nextState = nextState.set('smallTexture', data);

    return nextState;
  },

  [LOAD_ORIG]: function (state, { payload }) {
    const { key, data } = payload;
    let nextState = state;
    nextState = nextState.setIn(['origTexture', key], data);

    return nextState;
  }
});
