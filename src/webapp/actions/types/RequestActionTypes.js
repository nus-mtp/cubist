import TypeHelper from './TypeHelper';

const normalTypes = {
  NAVIGATE_START: null,
  NAVIGATE_COMPLETE: null
};

const promiseTypes = {

};

export default TypeHelper.combineTypes(normalTypes, promiseTypes);
