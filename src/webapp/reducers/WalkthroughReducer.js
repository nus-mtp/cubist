import Immutable from 'immutable';

import { Constants } from 'common';
import ReducerHelper from './ReducerHelper';
import {
  // Model Actions
  REQ_GET_MODEL,
  REQ_POST_CREATE_MODEL,
  // Walkthrough Actions
  REQ_PUT_ADD_WALKTHROUGH,
  REQ_PUT_UPDATE_WALKTHROUGH,
  REQ_PUT_DELETE_WALKTHROUGH,
  PLAYBACK_WALKTHROUGH,
  SET_PLAYBACK_START,
  SET_PLAYBACK_END,
  VIEW_WALKTHROUGH_POINT,
  INSERT_POINT
} from 'webapp/actions/types';

const initialState = Immutable.fromJS({
  points: [],
  playbackPoints: [0, 0],
  walkthroughToggle: false,
  viewIndex: -1
});

const WalkthroughReducerHelper = {
  updateWalkthroughFromModel(state, { promiseState, res }) {
    let nextState = state;
    if (promiseState === Constants.PROMISE_STATE_SUCCESS) {
      const model = Immutable.fromJS(res.body);
      nextState = nextState.set('points', model.get('walkthroughs', new Immutable.List()));
    }

    return nextState;
  }
};

export default ReducerHelper.createReducer(initialState, {
  [REQ_GET_MODEL]: WalkthroughReducerHelper.updateWalkthroughFromModel,
  [REQ_POST_CREATE_MODEL]: WalkthroughReducerHelper.updateWalkthroughFromModel,

  [REQ_PUT_ADD_WALKTHROUGH]: WalkthroughReducerHelper.updateWalkthroughFromModel,
  [REQ_PUT_UPDATE_WALKTHROUGH]: WalkthroughReducerHelper.updateWalkthroughFromModel,
  [REQ_PUT_DELETE_WALKTHROUGH]: WalkthroughReducerHelper.updateWalkthroughFromModel,

  [PLAYBACK_WALKTHROUGH]: (state) => {
    const nextState = state;

    return nextState.set('walkthroughToggle', !state.get('walkthroughToggle'));
  },

  [SET_PLAYBACK_START]: (state, { payload }) => {
    const nextState = state;
    const { startIndex } = payload;

    return nextState.setIn(['playbackPoints', 0], startIndex);
  },

  [SET_PLAYBACK_END]: (state, { payload }) => {
    const nextState = state;
    const { endIndex } = payload;

    return nextState.setIn(['playbackPoints', 1], endIndex);
  },

  [VIEW_WALKTHROUGH_POINT]: (state, { payload }) => {
    const nextState = state;
    const { index } = payload;

    return nextState.set('viewIndex', index);
  },

  [INSERT_POINT]: (state, { payload }) => {
    const { index, controlToggle, pos, lookAt, snapshot } = payload;

    let targetIndex = index;

    if (controlToggle === 'after') {
      targetIndex++;
    }

    const snapshotToken = snapshot;
    const quaternion = { x: 0, y: 0, z: 0, w: 0 };
    const animationMode = 'Stationary';
    const duration = 1.00;


    let nextState = state;
    nextState = nextState.update('points', points => {
      return points.insert(targetIndex, Immutable.fromJS({ pos, lookAt, quaternion, animationMode, duration, snapshotToken }));
    });
    return nextState;
  }

});
