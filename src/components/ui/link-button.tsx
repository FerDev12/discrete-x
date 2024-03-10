import { AnchorHTMLAttributes, forwardRef } from 'react';
import { Link } from './link';
import { LinkProps } from 'next/link';
import { buttonVariants } from './button';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

export interface LinkButtonProps
  extends LinkProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    VariantProps<typeof buttonVariants> {}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  function LinkButton({ className, variant, size, ...props }, ref) {
    return (
      <Link
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
