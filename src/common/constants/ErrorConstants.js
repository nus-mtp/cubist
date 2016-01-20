/**
 * Error Constants
 * @type {Object}
 */
const ErrorConstants = {
  // Authorisation Errors
  ERROR_TOKEN_DID_NOT_EXIST: 'Token does not exist',
  ERROR_TOKEN_UNVERIFIED: 'Token cannot be verified',
  ERROR_ADMIN_TOKEN_DID_NOT_EXIST: 'Admin token does not exist',
  ERROR_ADMIN_TOKEN_UNVERIFIED: 'Admin token cannot be verified',
  ERROR_ADMIN_TOKEN_INVALID: 'Admin token is invalid',

  // Mongoose Errors
  ERROR_MONGOOSE_DID_EXIST: 'MongoDB Object did exist',
  ERROR_MONGOOSE_DID_NOT_EXIST: 'MongoDB Object did not exist',
  ERROR_NOT_MONGOOSE_OBJECT: 'Not mongoose object'
};

export default ErrorConstants;
