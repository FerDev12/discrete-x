import { Login } from '@/modules/auth/components/login';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { userId } = auth();

  if (userId) {
    return redirect(`/`);
  }

  return <Login />;
}
