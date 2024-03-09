'use client';

import { GithubIcon } from '@/components/icons/github';
import { Button } from '@/components/ui/button';
import { useSignIn } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function GithubOAuthButton({ type }: { type: 'signup' | 'login' }) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signIn } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  const onSignIn = async () => {
    if (!isLoaded || isLoading) return;

    setIsLoading(true);

    try {
      await signIn.authenticateWithRedirect({
        redirectUrl: '/sso-callback',
        strategy: 'oauth_github',
        redirectUrlComplete: `?${searchParams}`,
      });
    } catch (err: any) {
      toast.error(err.errors[0].message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type='button'
      variant='outline'
      className='w-full'
      disabled={isLoading}
      onClick={onSignIn}
    >
      {isLoading ? (
        <Loader2 className='w-4 h-4 animate-spin mr-2' />
      ) : (
        <GithubIcon className='w-4 h-4 mr-2' />
      )}
      <p>
        <span className='capitalize'>{type}</span> with Github
      </p>
    </Button>
  );
}
