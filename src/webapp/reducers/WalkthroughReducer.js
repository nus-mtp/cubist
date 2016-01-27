import Immutable from 'immutable';

import ReducerHelper from './ReducerHelper';
import {
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
    const posX = 0;
    const posY = 0;
    const posZ = 0;
    const disjointMode = true;
    const animationMode = 'Stationary';
    const duration = 1.00;

    let nextState = state;
    nextState = nextState.update('points', points =>
      points.push(new Immutable.Map({ posX, posY, posZ, disjointMode, animationMode, duration })));
    return nextState;
  },

  [UPDATE_POINT]: (state, { payload }) => {
    const { posX, posY, posZ } = payload;
    const disjointMode = state.get('points').get(payload.index).get('disjointMode');
    const animationMode = state.get('points').get(payload.index).get('animationMode');
    const duration = state.get('points').get(payload.index).get('duration');
    const nextState = state;
    return nextState.update('points', points =>
     points.set(payload.index, new Immutable.Map({ posX, posY, posZ, disjointMode, animationMode, duration })));
  },

  [DELETE_POINT]: (state, { payload }) => {
    const nextState = state;
    return nextState.update('points', points => points.delete(payload.index));
  },

  [TOGGLE_DISJOINT]: (state, { payload }) => {
    const posX = state.get('points').get(payload.index).get('posX');
    const posY = state.get('points').get(payload.index).get('posY');
    const posZ = state.get('points').get(payload.index).get('posZ');
    const disjointMode = !state.get('points').get(payload.index).get('disjointMode');
    const duration = state.get('points').get(payload.index).get('duration');
    let animationMode;

    if (disjointMode) {
      animationMode = 'Stationary';
    } else {
      animationMode = state.get('points').get(payload.index).get('animationMode');
    }

    const nextState = state;
    return nextState.update('points', points =>
      points.set(payload.index, new Immutable.Map({ posX, posY, posZ, disjointMode, animationMode, duration })));
  },

  [UPDATE_ANIMATION]: (state, { payload }) => {
    const posX = state.get('points').get(payload.index).get('posX');
    const posY = state.get('points').get(payload.index).get('posY');
    const posZ = state.get('points').get(payload.index).get('posZ');
    const disjointMode = state.get('points').get(payload.index).get('disjointMode');
    const duration = state.get('points').get(payload.index).get('duration');
    const animationMode = payload.animationMode;

    const nextState = state;
    return nextState.update('points', points =>
      points.set(payload.index, new Immutable.Map({ posX, posY, posZ, disjointMode, animationMode, duration })));
  },

  [UPDATE_DURATION]: (state, { payload }) => {
    const posX = state.get('points').get(payload.index).get('posX');
    const posY = state.get('points').get(payload.index).get('posY');
    const posZ = state.get('points').get(payload.index).get('posZ');
    const disjointMode = state.get('points').get(payload.index).get('disjointMode');
    const animationMode = state.get('points').get(payload.index).get('animationMode');
    const duration = payload.animationDuration;

    const nextState = state;
    return nextState.update('points', points =>
      points.set(payload.index, new Immutable.Map({ posX, posY, posZ, disjointMode, animationMode, duration })));
  }

});
