import TypeHelper from './TypeHelper';

// Normal Action Types
const normalTypes = {
  REQ_PUT_ADD_WALKTHROUGH: null,
  REQ_PUT_UPDATE_WALKTHROUGH: null,
  REQ_PUT_DELETE_WALKTHROUGH: null,
  PLAYBACK_WALKTHROUGH: null,
  SET_PLAYBACK_START: null,
  SET_PLAYBACK_END: null,
  VIEW_WALKTHROUGH_POINT: null
};

// Promise Action Types
const promiseTypes = {

};

export default TypeHelper.combineTypes(normalTypes, promiseTypes);
