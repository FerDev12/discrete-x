import { BaseError, SerializedError } from './base-error';

export class UnauthorizedError extends BaseError {
  status = 403;
  name = 'Unauthorized';

  constructor(message = 'Unauthorized request') {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeError(): SerializedError {
    return {
      status: this.status,
      name: this.name,
      message: this.message,
    };
  }
}
