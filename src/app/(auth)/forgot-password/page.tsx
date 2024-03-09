import ForgotPassword from '@/modules/auth/components/forgot-password';
import { RedirectToSignIn, auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function ForgotPasswordPage() {
  const { userId } = auth();

  if (userId) {
    return redirect('/');
  }

  return <ForgotPassword />;
}
