import { ArrowRight, Triangle } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { LinkButton } from './ui/link-button';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { UserButton } from '@/modules/users/components/user-button';

export function Header() {
  return (
    <header className='sticky top-0 inset-0 h-16 z-50 border-b bg-background'>
      <div className='container flex items-center justify-between h-full w-full'>
        <LinkButton href='/' size='icon' variant='ghost'>
          <Triangle className='text-rose-500' />
        </LinkButton>
        <div className='flex items-center space-x-2'>
          <ModeToggle />
          <SignedOut>
            <LinkButton href='/login' className='group' variant='outline'>
              Get Started{' '}
              <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform' />
            </LinkButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
