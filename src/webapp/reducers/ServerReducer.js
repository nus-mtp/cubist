import Immutable from 'immutable';

import ReducerHelper from './ReducerHelper';
import {
  REDIRECT_SERVER,
  FIRST_TIME
} from 'webapp/actions/types';

const initialState = Immutable.fromJS({
  firstTime: true
});

export default ReducerHelper.createReducer(initialState, {
  [REDIRECT_SERVER]: (state, { redirect }) => {
    return state.merge({
      redirect
    });
  },

  [FIRST_TIME]: (state) => {
    return state.update('firstTime', () => false);
  }
});
