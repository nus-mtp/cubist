import Immutable from 'immutable';

import ReducerHelper from './ReducerHelper';
import {
  // Walkthrough Actions
  ADD_POINT,
  UPDATE_POINT,
  DELETE_POINT,
  TOGGLE_DISJOINT,
  UPDATE_ANIMATION,
  UPDATE_DURATION
} from 'webapp/actions/types';

const initialState = Immutable.fromJS({
  points: []
});

export default ReducerHelper.createReducer(initialState, {
  [ADD_POINT]: (state) => {
    const pos = { x: 0, y: 0, z: 0 };
    const disjointMode = true;
    const animationMode = 'Stationary';
    const duration = 1.00;

    let nextState = state;
    nextState = nextState.update('points', points => {
      return points.push(Immutable.fromJS({ pos, disjointMode, animationMode, duration }));
    });
    return nextState;
  },

  [UPDATE_POINT]: (state, { payload }) => {
    const nextState = state;
    const { pos, index, snapshotToken } = payload;
    return nextState
      .setIn(['points', index, 'pos'], Immutable.fromJS(pos))
      .setIn(['points', index, 'snapshotToken'], snapshotToken);
  },

  [DELETE_POINT]: (state, { payload }) => {
    const nextState = state;
    return nextState.update('points', points => points.delete(payload.index));
  },

  [TOGGLE_DISJOINT]: (state, { payload }) => {
    const nextState = state;
    const { index } = payload;
    const disjointMode = !state.get('points').getIn([index, 'disjointMode']);
    let animationMode;
    if (disjointMode) {
      animationMode = 'Stationary';
    } else {
      animationMode = state.get('points').get(payload.index).get('animationMode');
    }

    return nextState
      .setIn(['points', index, 'disjointMode'], disjointMode)
      .setIn(['points', index, 'animationMode'], animationMode);
  },

  [UPDATE_ANIMATION]: (state, { payload }) => {
    const nextState = state;
    const { index, animationMode } = payload;

    return nextState.setIn(['points', index, 'animationMode'], animationMode);
  },

  [UPDATE_DURATION]: (state, { payload }) => {
    const nextState = state;
    const { index, duration } = payload;

    return nextState.setIn(['points', index, 'duration'], duration);
  }
});
