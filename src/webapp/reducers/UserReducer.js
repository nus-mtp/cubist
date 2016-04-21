import Immutable from 'immutable';

import { Constants } from 'common';
import ReducerHelper from './ReducerHelper';
import {
  REQ_GET_USERS,
  REQ_GET_USER,
  REQ_GET_USER_ME,
  REQ_GET_USER_USER_INFO,
  REQ_GET_USER_ADMIN_INFO,
  REQ_POST_USER_LOGIN,
  REQ_POST_USER_LOGOUT,
  REQ_POST_USER_RESET_PASSWORD,
  REQ_DEL_USER
} from 'webapp/actions/types';

const initialState = Immutable.fromJS({
  // The own user ID of the current session
  ownUserId: null,
  // The current focus user ID
  currentUserId: null,
  userIds: Immutable.List(),
  // Users Map
  users: Immutable.Map()
});

export default ReducerHelper.createReducer(initialState, {
  [REQ_GET_USERS]: function (state, { promiseState, res }) {
    let nextState = state;
    if (promiseState === Constants.PROMISE_STATE_SUCCESS) {
      const users = res.body;
      const userMap = Immutable.fromJS(
        users.reduce((m, user) => {
          m[user._id] = user;
          return m;
        }, {})
      );
      const userIds = Immutable.fromJS(
        users.map(u => u._id)
      );
      nextState = nextState
        .update('users', m => m.merge(userMap))
        .set('userIds', userIds);
    }

    return nextState;
  },

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

  [REQ_POST_USER_RESET_PASSWORD]: state => state,
  [REQ_DEL_USER](state, { promiseState, payload }) {
    let nextState = state;
    if (promiseState === Constants.PROMISE_STATE_SUCCESS) {
      nextState = nextState
        .update('userIds', list => list.filter(m => m !== payload))
        .deleteIn(['models', payload]);
    }

    return nextState;
  }
});
