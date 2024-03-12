import './globals.css';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { cn } from '@/lib/utils/cn';

export const metadata: Metadata = {
  title: 'Discrete X',
  description: 'Next gen, private messaging.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body
          className={cn(
            'bg-background antialiased font-mono',
            GeistSans.variable,
            GeistMono.variable
          )}
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position='top-right' />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
