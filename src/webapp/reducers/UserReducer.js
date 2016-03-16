import Immutable from 'immutable';

import { Constants } from 'common';
import ReducerHelper from './ReducerHelper';
import {
  REQ_GET_USER,
  REQ_GET_USER_ME,
  REQ_GET_USER_USER_INFO,
  REQ_GET_USER_ADMIN_INFO,
  REQ_POST_USER_LOGIN,
  REQ_POST_USER_LOGOUT,
  REQ_POST_USER_RESET_PASSWORD
} from 'webapp/actions/types';

const initialState = Immutable.fromJS({
  // The own user ID of the current session
  ownUserId: null,
  // The current focus user ID
  currentUserId: null,
  // Users Map
  users: Immutable.Map()
});

export default ReducerHelper.createReducer(initialState, {
  [REQ_GET_USER]: function (state, { promiseState, res }) {
    let nextState = state;
    if (promiseState === Constants.PROMISE_STATE_SUCCESS) {
      const user = res.body;
      nextState = nextState
        .setIn(['users', user._id], Immutable.fromJS(user))
        .set('currentUserId', user._id);
    }

    return nextState;
  },

  [REQ_GET_USER_ME]: function (state, { promiseState, res }) {
    let nextState = state;
    if (promiseState === Constants.PROMISE_STATE_SUCCESS) {
      const user = res.body;
      if (user) {
        nextState = nextState
          .setIn(['users', user._id], Immutable.fromJS(user))
          .set('ownUserId', user._id);
      } else {
        nextState = nextState.merge({
          isRegistered: false,
          ownUserId: null
        });
      }
    }

    return nextState;
  },

  [REQ_GET_USER_USER_INFO]: function (state, { promiseState, res }) {
    let nextState = state;
    if (promiseState === Constants.PROMISE_STATE_SUCCESS) {
      const user = res.body;
      nextState = nextState.merge({
        ownUserId: user._id,
        users: { [user._id]: user }
      });
    }

    return nextState;
  },

  [REQ_GET_USER_ADMIN_INFO]: function (state, { promiseState, res }) {
    let nextState = state;
    if (promiseState === Constants.PROMISE_STATE_SUCCESS) {
      const user = res.body;
      nextState = nextState.merge({
        ownUserId: user._id,
        users: { [user._id]: user }
      });
    }

    return nextState;
  },

  [REQ_POST_USER_LOGIN]: function (state, { promiseState, res }) {
    let nextState = state;
    if (promiseState === Constants.PROMISE_STATE_SUCCESS) {
      const user = res.body;
      nextState = nextState.merge({
        ownUserId: user._id,
        users: { [user._id]: user }
      });
    }

    return nextState;
  },

  [REQ_POST_USER_LOGOUT]: function (state, { promiseState }) {
    let nextState = state;
    if (promiseState === Constants.PROMISE_STATE_SUCCESS) {
      nextState = nextState.set('ownUserId', null);
    }

    return nextState;
  },

  [REQ_POST_USER_RESET_PASSWORD]: state => state
});
