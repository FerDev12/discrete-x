import { BaseError } from '@/lib/errors/base-error';
import { InternalServerError } from '@/lib/errors/internal-server-error';

export function handleError(err: unknown) {
  return {
    error:
      err instanceof BaseError
        ? err.serializeError()
        : new InternalServerError().serializeError(),
    data: null,
  };
}
