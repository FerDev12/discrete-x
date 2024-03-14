import { ZodError } from 'zod';
import {
  BaseError,
  SerializedError as BaseSerializedError,
} from './base-error';

type ZodValidationError = {
  path: string;
  code: string;
  message: string;
};

type SerializedError = BaseSerializedError & {
  errors: ZodValidationError[];
};

export class ValidationError extends BaseError {
  status = 422;
  name = 'Validation Error';
  errors: ZodValidationError[] = [];
  constructor(error: ZodError, message = 'Validation failed') {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);

    this.errors = error.errors.map((err) => ({
      path: err.path[0].toString(),
      message: err.message,
      code: err.code,
    }));
  }

  serializeError(): SerializedError {
    return {
      name: this.name,
      status: this.status,
      message: this.message,
      errors: this.errors,
    };
  }
}
