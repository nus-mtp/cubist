import Immutable from 'immutable';

import ReducerHelper from './ReducerHelper';
import {
  SNAPSHOT_TRIGGER,
  SNAPSHOT_SUCCESS
} from 'webapp/actions/types';

const initialState = Immutable.fromJS({
  snapshotToken: undefined,
  snapshots: new Immutable.Map()
});

export default ReducerHelper.createReducer(initialState, {
  [SNAPSHOT_TRIGGER]: function (state, payload) {
    let nextState = state;
    nextState = nextState.set('snapshotToken', payload);

    return nextState;
  },

  [SNAPSHOT_SUCCESS]: function (state, { token, data }) {
    let nextState = state;
    nextState = nextState.setIn(['snapshots', token], data);

    return nextState;
  }
});
