'use client';

import { Button } from '@/components/ui/button';
import { Input, InputProps } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils/cn';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';

export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<InputProps, 'type'>
>(function PasswordInput({ className, ...props }, ref) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className='relative'>
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-10', className)}
        {...props}
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type='button'
              size='icon'
              variant='ghost'
              className='absolute top-0 right-0 text-muted-foreground'
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeIcon className='w-5 h-5' />
              ) : (
                <EyeOffIcon className='w-5 h-5' />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {showPassword ? 'Hide password' : 'Show password'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});
