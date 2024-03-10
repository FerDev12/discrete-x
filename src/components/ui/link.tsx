import { AnchorHTMLAttributes, forwardRef } from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { cn } from '@/lib/utils/cn';

interface LinkProps
  extends NextLinkProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, ...props },
  ref
) {
  return (
    <NextLink
      ref={ref}
      className={cn(
        'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...props}
    />
  );
});
