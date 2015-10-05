import Immutable from 'immutable';

import ReducerHelper from './ReducerHelper';
import {
  REQUEST_REDIRECT,
  REQUEST_FIRST_TIME
} from 'webapp/app/actions/types';

const initialState = Immutable.fromJS({
  firstTime: true
});

export default ReducerHelper.createReducer(initialState, {
  [REQUEST_REDIRECT]: (state, {redirect}) => {
    return state.merge({
      redirect
    });
  },

  [REQUEST_FIRST_TIME]: (state) => {
    return state.update('firstTime', () => false);
  }
});
