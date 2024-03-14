import { BaseError, SerializedError } from './base-error';

export class BadRequestError extends BaseError {
  status = 400;
  name = 'Bad Request';

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeError(): SerializedError {
    return {
      status: this.status,
      name: this.name,
      message: this.message,
    };
  }
}
