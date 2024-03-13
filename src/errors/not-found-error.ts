import { BaseError, SerializedError } from './base-error';

export class NotFoundError extends BaseError {
  name = 'Not Found';
  status = 404;

  constructor(message = 'Record not found') {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError(): SerializedError {
    return {
      status: this.status,
      name: this.name,
      message: this.message,
    };
  }
}
