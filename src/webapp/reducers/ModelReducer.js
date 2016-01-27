import Immutable from 'immutable';

import { Constants } from 'common';
import ReducerHelper from './ReducerHelper';
import {
  REQ_GET_MODEL
} from 'webapp/actions/types';

const initialState = Immutable.fromJS({
  modelId: null,
  modelIds: new Immutable.List(),
  models: new Immutable.Map()
});

export default ReducerHelper.createReducer(initialState, {
  [REQ_GET_MODEL](state, { promiseState, res }) {
    let nextState = state;
    if (promiseState === Constants.PROMISE_STATE_SUCCESS) {
      const model = Immutable.fromJS(res.body);
      nextState = nextState
        .setIn(['models', model.get('_id')], model)
        .set('modelId', model.get('_id'));
    }

    return nextState;
  }
});
