import TypeHelper from './TypeHelper';

// Normal Action Types
const normalTypes = {

};

// Promise Action Types
const promiseTypes = {
  REQ_GET_MODEL: null,
  REQ_GET_TOP_MODELS: null,
  REQ_GET_LATEST_MODELS: null,

  REQ_POST_CREATE_MODEL: null,

  REQ_PUT_UPDATE_MODEL_INFO: null,
  REQ_PUT_ADD_MODEL_SNAPSHOTS: null,
  REQ_PUT_REMOVE_MODEL_SNAPSHOT: null
};

export default TypeHelper.combineTypes(normalTypes, promiseTypes);
