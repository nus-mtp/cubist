import TypeHelper from './TypeHelper';

// Normal Action Types
const normalTypes = {
  SNAPSHOT_TRIGGER: null,
  SNAPSHOT_SUCCESS: null
};

// Promise Action Types
const promiseTypes = {

};

export default TypeHelper.combineTypes(normalTypes, promiseTypes);
