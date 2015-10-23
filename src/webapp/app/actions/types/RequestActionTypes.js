import TypeHelper from './TypeHelper';

const normalTypes = {
  REDIRECT: null,
  REQUEST_FIRST_TIME: null
};

const promiseTypes = {

};

export default TypeHelper.combineTypes(normalTypes, promiseTypes);
