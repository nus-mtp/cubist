import Immutable from 'immutable';

import ReducerHelper from './ReducerHelper';
import {
  ADD_POINT,
  UPDATE_POINT,
  DELETE_POINT,
  TOGGLE_DISJOINT,
  UPDATE_ANIMATION
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

    let nextState = state;
    nextState = nextState.update('points', points =>
      points.push(new Immutable.Map({ posX, posY, posZ, disjointMode, animationMode })));
    return nextState;
  },

  [UPDATE_POINT]: (state, { payload }) => {
    const { posX, posY, posZ } = payload;
    const disjointMode = state.get('points').get(payload.index).get('disjointMode');
    const animationMode = state.get('points').get(payload.index).get('animationMode');
    const nextState = state;
    return nextState.update('points', points =>
     points.set(payload.index, new Immutable.Map({ posX, posY, posZ, disjointMode, animationMode })));
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
    let animationMode;

    if (disjointMode) {
      animationMode = 'Stationary';
    } else {
      animationMode = state.get('points').get(payload.index).get('animationMode');
    }

    const nextState = state;
    return nextState.update('points', points =>
      points.set(payload.index, new Immutable.Map({ posX, posY, posZ, disjointMode, animationMode })));
  },

  [UPDATE_ANIMATION]: (state, { payload }) => {
    const posX = state.get('points').get(payload.index).get('posX');
    const posY = state.get('points').get(payload.index).get('posY');
    const posZ = state.get('points').get(payload.index).get('posZ');
    const disjointMode = state.get('points').get(payload.index).get('disjointMode');
    const animationMode = payload.animationMode;

    const nextState = state;
    return nextState.update('points', points =>
      points.set(payload.index, new Immutable.Map({ posX, posY, posZ, disjointMode, animationMode })));
  }

});
