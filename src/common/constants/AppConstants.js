import keymirror from 'keymirror';

/**
 * Application Constants
 * @type {Object}
 */
const AppConstants = {
  // Promise States
  ...keymirror({
    PROMISE_STATE_PENDING: null,
    PROMISE_STATE_SUCCESS: null,
    PROMISE_STATE_FAILURE: null
  }),

  // User Roles
  ROLE_USER: 'user',
  ROLE_ADMIN: 'admin'
};

export default AppConstants;
