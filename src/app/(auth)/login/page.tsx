import { Login } from '@/modules/auth/components/login';
import { auth } from '@clerk/nextjs';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login',
};

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
