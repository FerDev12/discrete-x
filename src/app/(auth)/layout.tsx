import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className='flex items-center justify-center min-h-screen'>
      {children}
    </section>
  );
}
