import keymirror from 'keymirror';

/**
 * Application Constants
 * @type {Object}
 */
const AppConstants = {
  TOKEN_KEY: 'X-Cubist-Token',

  // Email Template ID
  EMAIL_SENDER_ADDRESS: 'support@cubist3d.me',
  EMAIL_SENDER_NAME: 'Cubist3D Administrator',

  // Promise States
  ...keymirror({
    PROMISE_STATE_PENDING: null,
    PROMISE_STATE_SUCCESS: null,
    PROMISE_STATE_FAILURE: null
  }),

  // User Roles
  ROLE_USER: 'user',
  ROLE_ADMIN: 'admin',

  // Model Categories
  MODEL_CATEGORIES: ['Character', 'Game', 'Animal', 'Scene', 'Vehicle', 'Object', 'Architecture', 'Misc']
};

export default AppConstants;
