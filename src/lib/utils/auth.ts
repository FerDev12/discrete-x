import { auth as clerkAuth } from '@clerk/nextjs';
import 'server-only';

export async function auth2() {
  const data = clerkAuth();
  if (!data.userId) {
    throw new Error('Unauthorized');
  }
  return data;
}
