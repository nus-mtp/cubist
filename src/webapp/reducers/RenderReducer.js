import Immutable from 'immutable';

import ReducerHelper from './ReducerHelper';
import {
  WIREFRAME_TOGGLE,
  SHADING_TOGGLE,
  AUTO_ROTATE_TOGGLE,
  RESET_VIEW_TOGGLE,
  PLAY_WALKTHROUGH,
  TEXTURE_TOGGLE
} from 'webapp/actions/types';

const initialState = Immutable.fromJS({
  wireframe: false,
  shadingMode: 0,
  autoRotate: false,
  resetViewToggle: false,
  playbackWalkthroughToggle: false,
  resizedTexture: false
});

export default ReducerHelper.createReducer(initialState, {
  [WIREFRAME_TOGGLE]: (state) => {
    let nextState = state;
    nextState = nextState.set('wireframe', !nextState.get('wireframe'));

    return nextState;
  },

  [SHADING_TOGGLE]: (state) => {
    let nextState = state;
    nextState = nextState.set('shadingMode', (nextState.get('shadingMode') + 1) % 4);

    return nextState;
  },

  [AUTO_ROTATE_TOGGLE]: (state) => {
    let nextState = state;
    nextState = nextState.set('autoRotate', !nextState.get('autoRotate'));

    return nextState;
  },

  [RESET_VIEW_TOGGLE]: (state) => {
    let nextState = state;
    nextState = nextState.set('resetViewToggle', !nextState.get('resetViewToggle'));

    return nextState;
  },

  [PLAY_WALKTHROUGH]: (state) => {
    let nextState = state;
    nextState = nextState.set('playbackWalkthroughToggle', !nextState.get('playbackWalkthroughToggle'));

    return nextState;
  },

  [TEXTURE_TOGGLE]: (state) => {
    let nextState = state;
    nextState = nextState.set('resizedTexture', !nextState.get('resizedTexture'));

    return nextState;
  }
});
