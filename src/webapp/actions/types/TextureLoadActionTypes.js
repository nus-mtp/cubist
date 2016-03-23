import TypeHelper from './TypeHelper';

// Normal Action Types
const normalTypes = {
  LOAD_SMALL: null,
  LOAD_ORIG: null
};

// Promise Action Types
const promiseTypes = {

};

export default TypeHelper.combineTypes(normalTypes, promiseTypes);
