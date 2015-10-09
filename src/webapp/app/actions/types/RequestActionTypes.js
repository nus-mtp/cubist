import TypeHelper from './TypeHelper';

const normalTypes = {
  REQUEST_REDIRECT: null,
  REQUEST_FIRST_TIME: null
};

const promiseTypes = {

};

export default TypeHelper.combineTypes(normalTypes, promiseTypes);
