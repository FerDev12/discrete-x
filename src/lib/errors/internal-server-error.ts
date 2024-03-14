import { BaseError, SerializedError } from './base-error';

export class InternalServerError extends BaseError {
  status = 500;
  name = 'Internal Server Error';

  constructor(message = 'Internal Server Error') {
    super(message);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  serializeError(): SerializedError {
    return {
      name: this.name,
      status: this.status,
      message: this.message,
    };
  }
}
