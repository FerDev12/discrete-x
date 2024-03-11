import { Header } from '@/components/header';
import { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className='container'>{children}</main>
    </>
  );
}
