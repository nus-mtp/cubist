import TypeHelper from './TypeHelper';

const normalTypes = {

};

const promiseTypes = {
  REQ_GET_USER_ME: null,
  REQ_GET_USER_USER_INFO: null,
  REQ_GET_USER_ADMIN_INFO: null,

  REQ_POST_USER_REGISTER: null,
  REQ_POST_USER_LOGIN: null,
  REQ_POST_USER_LOGOUT: null,
  REQ_POST_USER_RESET_PASSWORD: null
};

export default TypeHelper.combineTypes(normalTypes, promiseTypes);
