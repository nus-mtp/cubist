import TypeHelper from './TypeHelper';

// Normal Action Types
const normalTypes = {
  CAMERA_ORBIT: null,
  CAMERA_UPDATE: null
};

// Promise Action Types
const promiseTypes = {

};

export default TypeHelper.combineTypes(normalTypes, promiseTypes);
