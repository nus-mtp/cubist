import ExtendableError from './ExtendableError';

/**
 * ClientError Class
 */
class ClientError extends ExtendableError {
  constructor(message, statusCode = 400, errorCode = 0) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export default ClientError;
