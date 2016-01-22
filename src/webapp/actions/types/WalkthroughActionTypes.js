import TypeHelper from './TypeHelper';

// Normal Action Types
const normalTypes = {
  ADD_POINT: null,
  UPDATE_POINT: null,
  DELETE_POINT: null,
  TOGGLE_DISJOINT: null
};

// Promise Action Types
const promiseTypes = {

};

export default TypeHelper.combineTypes(normalTypes, promiseTypes);
