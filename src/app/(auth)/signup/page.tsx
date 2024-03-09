import { Signup } from '@/modules/auth/components/signup';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function SignupPage() {
  const { userId } = auth();

  if (userId) {
    return redirect('/');
  }

  return <Signup />;
}
