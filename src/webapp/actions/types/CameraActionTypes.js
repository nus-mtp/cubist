import TypeHelper from './TypeHelper';

// Normal Action Types
const normalTypes = {
  CAMERA_PAN: null,
  CAMERA_ROTATE: null,
  CAMERA_ZOOM: null
};

// Promise Action Types
const promiseTypes = {

};

export default TypeHelper.combineTypes(normalTypes, promiseTypes);
