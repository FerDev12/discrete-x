import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { LinkButton } from './ui/link-button';

export function Hero() {
  return (
    <section className='flex items-center justify-between min-h-screen'>
      <div className='p-4'>
        <div className='mb-8'>
          <h1 className='text-5xl md:text-7xl font-semibold mb-2'>
            Discreet X
          </h1>
          <p className='text-lg text-muted-foreground'>
            Private and secure by default.
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <LinkButton href='/about' variant='ghost'>
            Learn more
          </LinkButton>
          <LinkButton href='/login' className='group'>
            Get Started{' '}
            <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform' />
          </LinkButton>
        </div>
      </div>
      <div></div>
    </section>
  );
}
