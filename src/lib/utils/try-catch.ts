import 'server-only';
import { handleError } from './handle-error';

export async function tryCatch<ReturnType>(cb: () => Promise<ReturnType>) {
  try {
    const data = await cb();
    return { error: null, data };
  } catch (err: unknown) {
    return handleError(err);
  }
}
