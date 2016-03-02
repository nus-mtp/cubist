import Immutable from 'immutable';
import { Constants } from 'common';
import ReducerHelper from './ReducerHelper';
import {
  REQ_GET_BROWSE_RESULTS
} from 'webapp/actions/types';

const initialState = Immutable.fromJS({
  resultsModels: new Immutable.List()
});

export default ReducerHelper.createReducer(initialState, {
  [REQ_GET_BROWSE_RESULTS](state, { promiseState, res }) {
    let nextState = state;
    if (promiseState === Constants.PROMISE_STATE_SUCCESS) {
      const results = Immutable.fromJS(res.body);
      nextState = nextState.set('resultsModels', results);
    }
    return nextState;
  }
});
