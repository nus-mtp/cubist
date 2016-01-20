const FieldRanges = {
  // User Range
  USER_EMAIL_MIN_LENGTH: 1,
  USER_NAME_MIN_LENGTH: 1,
  USER_PASSWORD_MIN_LENGTH: 6,
  USER_PASSWORD_MAX_LENGTH: 30
};

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
  ERROR_NOT_MONGOOSE_OBJECT: 'Not mongoose object',

  // User Errors
  ERROR_USER_ID_REQUIRED: 'User ID is required',
  ERROR_USER_EMAIL_REQUIRED: 'User email is required',
  ERROR_USER_EMAIL_MIN_LENGTH: `User email length should be at least ${ FieldRanges.USER_EMAIL_MIN_LENGTH }`,
  ERROR_USER_NAME_REQUIRED: 'User name is required',
  ERROR_USER_NAME_MIN_LENGTH: `User name length should be at least ${ FieldRanges.USER_NAME_MIN_LENGTH }`,
  ERROR_USER_PASSWORD_REQUIRED: 'User password is required',
  ERROR_USER_PASSWORD_MIN_LENGTH: `User password length should be at least ${ FieldRanges.USER_PASSWORD_MIN_LENGTH }`,
  ERROR_USER_PASSWORD_MAX_LENGTH: `User password length should be at most ${ FieldRanges.USER_PASSWORD_MAX_LENGTH }`,
  ERROR_USER_PASSWORD_INCORRECT: 'User password is incorrect',
  ERROR_USER_ROLE_NOT_ADMIN: 'User role is not admin'
};

export default {
  ...FieldRanges,
  ...ErrorConstants
};
