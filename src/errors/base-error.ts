export type SerializedError = {
  name: string;
  status: number;
  message: string;
};

export abstract class BaseError extends Error {
  abstract status: number;
  abstract name: string;

  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, BaseError.prototype);
  }

  abstract serializeError(): SerializedError;
}
