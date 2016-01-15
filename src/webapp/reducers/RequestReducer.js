import Immutable from 'immutable';

import { Constants } from 'common';
import { StringHelper } from 'webapp/helpers';
import { NAVIGATE_START, NAVIGATE_COMPLETE } from 'webapp/actions/types';

const initialState = Immutable.fromJS({
  navigateId: null,
  navigateMap: new Immutable.Map(),
  pendings: new Immutable.Map(),
  success: new Immutable.Map(),
  err: new Immutable.Map()
});

export default function (state = initialState, action) {
  // Convert to Immutable
  let currentState = state;
  if (!Immutable.Map.isMap(currentState) && !Immutable.List.isList(currentState)) {
    currentState = Immutable.fromJS(currentState);
  }

  // Handle navigate actions
  if (action.type === NAVIGATE_START) {
    const id = StringHelper.randomToken();
    return currentState
      .set('navigateId', id)
      .update('navigateMap', m => m.set(id, new Immutable.List()));
  } else if (action.type === NAVIGATE_COMPLETE) {
    return currentState
      .set('navigateId', null)
      .update('navigateMap', m => m.clear());
  }

  // Return current state if it is not a request action
  if (!action.type.startsWith('REQ_')) {
    return currentState;
  }

  let nextState = currentState;
  if (action.promiseState === Constants.PROMISE_STATE_NAVIGATE) {
    const { promiseState, navigateId, ...rest } = action;
    nextState = nextState
      .updateIn(
        ['navigateMap', navigateId],
        l => l.push({ ...rest, promiseState: Constants.PROMISE_STATE_SUCCESS }));
  } else if (action.promiseState === Constants.PROMISE_STATE_PENDING) {
    nextState = nextState
      .update('pendings', map => map.set(action.type, true))
      .update('success', map => map.delete(action.type))
      .update('err', map => map.delete(action.type));
  } else if (action.promiseState === Constants.PROMISE_STATE_SUCCESS) {
    nextState = nextState
      .update('pendings', map => map.delete(action.type))
      .update('success', map => map.set(action.type, true))
      .update('err', map => map.delete(action.type));
  } else if (action.promiseState === Constants.PROMISE_STATE_FAILURE) {
    nextState = nextState
      .update('pendings', map => map.delete(action.type))
      .update('success', map => map.delete(action.type))
      .update('err', map => map.set(action.type, Immutable.fromJS(action.res.body)));
  }

  if (!Immutable.Map.isMap(nextState) && !Immutable.List.isList(nextState)) {
    throw new Error('Reducers must return Immutable objects');
  }

  return nextState;
}
