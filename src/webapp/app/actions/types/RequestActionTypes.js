import TypeHelper from './TypeHelper';

// Normal Action Types
const normalTypes = {
  REDIRECT: null,
  REQUEST_FIRST_TIME: null
};

// Promise Action Types
const promiseTypes = {

};

export default TypeHelper.combineTypes(normalTypes, promiseTypes);
