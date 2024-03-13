import { Signup } from '@/modules/auth/components/signup';
import { auth } from '@clerk/nextjs';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Signup',
};

export default function SignupPage() {
  const { userId } = auth();

  if (userId) {
    return redirect('/');
  }

  return <Signup />;
}
