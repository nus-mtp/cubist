import TypeHelper from './TypeHelper';

// Normal Action Types
const normalTypes = {
  ADD_POINT: null,
  UPDATE_POINT: null,
  DELETE_POINT: null,
  TOGGLE_DISJOINT: null,
  UPDATE_ANIMATION: null,
  UPDATE_DURATION: null
};

// Promise Action Types
const promiseTypes = {

};

export default TypeHelper.combineTypes(normalTypes, promiseTypes);
