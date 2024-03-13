import { Header } from '@/components/header';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Header */}
      <Header />
      <main className='flex items-center justify-center min-h-screen/header'>
        {children}
      </main>
    </>
  );
}
