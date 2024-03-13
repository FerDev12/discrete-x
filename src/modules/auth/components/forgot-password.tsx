'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link } from '@/components/ui/link';
import { RestorePassword } from '@/modules/auth/components/restore-password-form';
import { useSignIn } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Metadata } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

const forgotPasswordFormSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordFormType = z.infer<typeof forgotPasswordFormSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(
    searchParams.get('successfulCreation') === 'true'
  );
  const { isLoaded, signIn } = useSignIn();

  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onCreate = async ({ email }: ForgotPasswordFormType) => {
    if (!isLoaded || isSubmitting) {
      return;
    }

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });

      setEmail(email);
      setSuccessfulCreation(true);
      router.push(
        `?${new URLSearchParams({
          successfulCreation: 'true',
        })}?${searchParams}`
      );
    } catch (err: any) {
      toast.error(err.errors[0].message);
    }
  };

  if (!isLoaded) {
    return null;
  }

  if (successfulCreation) {
    return <RestorePassword email={email} />;
  }

  return (
    <Card className='max-w-sm w-full shadow-md'>
      <CardHeader>
        <CardTitle>Forgot your password?</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form id='form-forgot_password' onSubmit={handleSubmit(onCreate)}>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>

      <CardFooter className='flex-col items-start space-y-4'>
        <Button
          type='submit'
          form='form-forget_password'
          loading={isSubmitting}
          className='w-full'
        >
          Continue
        </Button>

        <Link
          href={`/login?${searchParams}`}
          className='text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          Go to Login
        </Link>
      </CardFooter>
    </Card>
  );
}
