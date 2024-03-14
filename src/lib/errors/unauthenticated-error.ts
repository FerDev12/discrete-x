import { BaseError, SerializedError } from './base-error';

export class UnauthenticatedError extends BaseError {
  status = 401;
  name = 'Unauthenticated';

  constructor(message = 'Unauthenticated request') {
    super(message);
    Object.setPrototypeOf(this, UnauthenticatedError.prototype);
  }

  serializeError(): SerializedError {
    return {
      status: this.status,
      message: this.message,
      name: this.name,
    };
  }
}
