import Immutable from 'immutable';

import { Constants } from 'common';
import ReducerHelper from './ReducerHelper';
import {
  REQ_GET_MODELS,
  REQ_GET_MODEL,
  REQ_GET_TOP_MODELS,
  REQ_GET_LATEST_MODELS,
  REQ_POST_CREATE_MODEL,
  REQ_PUT_UPDATE_MODEL_INFO,
  REQ_PUT_TOGGLE_MODEL_FLAG,
  REQ_PUT_ADD_MODEL_SNAPSHOTS,
  REQ_PUT_REMOVE_MODEL_SNAPSHOT,
  REQ_GET_TEXTURES
} from 'webapp/actions/types';

const initialState = Immutable.fromJS({
  modelId: null,
  modelIds: new Immutable.List(),
  // List for Home Page
  latestModelIds: new Immutable.List(),
  topModelIds: new Immutable.List(),

  models: new Immutable.Map(),

  textures: new Immutable.List(),
  textureStatus: 0
});

const ModelReducerHelper = {
  toModelMap(models) {
    return Immutable.fromJS(
      models.reduce((m, model) => {
        m[model._id] = model;
        return m;
      }, {})
    );
  },
  toModelIds(models) {
    return Immutable.fromJS(
      models.map(model => model._id)
    );
  },

  updateModel(state, { promiseState, res }) {
    let nextState = state;
    if (promiseState === Constants.PROMISE_STATE_SUCCESS) {
      const model = Immutable.fromJS(res.body);
      nextState = nextState
        .setIn(['models', model.get('_id')], model)
        .set('modelId', model.get('_id'));
    }

    return nextState;
  },

  updateModels(state, { promiseState, res }) {
    let nextState = state;
    if (promiseState === Constants.PROMISE_STATE_SUCCESS) {
      const fetchedModelMap = ModelReducerHelper.toModelMap(res.body);
      const fetchedModelIds = ModelReducerHelper.toModelIds(res.body);
      nextState = nextState
        .update('models', m => m.merge(fetchedModelMap))
        .set('modelIds', fetchedModelIds);
    }

    return nextState;
  }
};

export default ReducerHelper.createReducer(initialState, {
  [REQ_GET_MODEL]: ModelReducerHelper.updateModel,
  [REQ_GET_MODELS]: ModelReducerHelper.updateModels,

  [REQ_GET_TOP_MODELS](state, { promiseState, res }) {
    let nextState = state;
    if (promiseState === Constants.PROMISE_STATE_SUCCESS) {
      const fetchedModelMap = ModelReducerHelper.toModelMap(res.body);
      const fetchedModelIds = ModelReducerHelper.toModelIds(res.body);
      nextState = nextState
        .update('models', m => m.merge(fetchedModelMap))
        .set('topModelIds', fetchedModelIds);
    }

    return nextState;
  },

  [REQ_GET_LATEST_MODELS](state, { promiseState, res }) {
    let nextState = state;
    if (promiseState === Constants.PROMISE_STATE_SUCCESS) {
      const fetchedModelMap = ModelReducerHelper.toModelMap(res.body);
      const fetchedModelIds = ModelReducerHelper.toModelIds(res.body);
      nextState = nextState
        .update('models', m => m.merge(fetchedModelMap))
        .set('latestModelIds', fetchedModelIds);
    }

    return nextState;
  },

  [REQ_GET_TEXTURES](state, { promiseState, res }) {
    let nextState = state;
    if (promiseState === Constants.PROMISE_STATE_SUCCESS) {
      const textureSet = res.body;
      nextState = nextState
        .update('textures', t => t.push(textureSet));
    }

    return nextState;
  },

  [REQ_POST_CREATE_MODEL]: ModelReducerHelper.updateModel,
  [REQ_PUT_UPDATE_MODEL_INFO]: ModelReducerHelper.updateModel,
  [REQ_PUT_ADD_MODEL_SNAPSHOTS]: ModelReducerHelper.updateModel,
  [REQ_PUT_REMOVE_MODEL_SNAPSHOT]: ModelReducerHelper.updateModel,
  [REQ_PUT_TOGGLE_MODEL_FLAG]: ModelReducerHelper.updateModel
});
