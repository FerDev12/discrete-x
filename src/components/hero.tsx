import { ArrowRight } from 'lucide-react';
import { LinkButton } from './ui/link-button';

export function Hero() {
  return (
    <section className='flex items-center justify-between min-h-screen/header'>
      <div className='p-4 text-center sm:text-left'>
        <div className='mb-8'>
          <h1 className='text-5xl sm:text-6xl md:text-9xl font-semibold mb-2'>
            Discrete X
          </h1>
          <p className='ml-1 text-lg text-muted-foreground'>
            Private and secure by default.
          </p>
        </div>
        <div className='flex flex-col-reverse sm:flex-row items-center gap-2'>
          <LinkButton href='/about' variant='ghost' className='w-full sm:w-fit'>
            Learn more
          </LinkButton>
          <LinkButton href='/login' className='group w-full sm:w-fit'>
            Get Started{' '}
            <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform' />
          </LinkButton>
        </div>
      </div>
      <div></div>
    </section>
  );
}
