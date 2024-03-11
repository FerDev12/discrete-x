'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PasswordInput } from './password-input';
import { useSignUp } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { VerifyEmailOTPForm } from './verify-email-otp';
import { toast } from 'sonner';
import { GithubOAuthButton } from './github-oauth-button';
import { Link } from '@/components/ui/link';

const signupFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters long.' }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(new RegExp(/\d/), {
      message: 'Password must include at least one numeric character.',
    })
    .trim(),
  confirmPassword: z
    .string()
    .min(8, { message: 'Confirm password must be at least 8 characters long.' })
    .regex(new RegExp(/\d/), {
      message: 'Confirm password must include at least one numeric character.',
    })
    .trim(),
});

type SignUpFormSchemaType = z.infer<typeof signupFormSchema>;

export function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(
    searchParams.get('verify') === 'true'
  );
  const { isLoaded, signUp, setActive } = useSignUp();
  const form = useForm<SignUpFormSchemaType>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: SignUpFormSchemaType) => {
    if (!isLoaded || isSubmitting) return;

    if (values.password !== values.confirmPassword) {
      form.setError('password', { message: 'Passwords do not match.' });
      form.setError('confirmPassword', { message: 'Passwords do not match.' });
      return;
    }

    try {
      await signUp.create({
        emailAddress: values.email,
        username: values.username,
        password: values.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      setIsVerifyingEmail(true);
      const currentParams = Object.fromEntries(searchParams.entries());
      router.push(
        `?${new URLSearchParams({
          ...currentParams,
          verify: 'true',
        })}`
      );
    } catch (err: any) {
      toast.error(err.errors[0].message);
    }
  };

  const onHandleVerification = async ({ code }: { code: string }) => {
    if (!isLoaded || isSubmitting) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== 'complete') {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push('/');
      }
    } catch (err: any) {
      toast.error(err.errors[0].message);
    }
  };

  if (!isLoaded) {
    return null;
  }

  if (isVerifyingEmail) {
    return (
      <VerifyEmailOTPForm
        email={form.getValues('email')}
        handleVerification={onHandleVerification}
      />
    );
  }

  return (
    <Card className='max-w-sm w-full shadow-md'>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>To continue to Discreet X</CardDescription>
      </CardHeader>

      <CardContent className='flex flex-col space-y-8'>
        <GithubOAuthButton type='signup' />

        <div className='relative w-full'>
          <Separator className='absolute inset-x-0 top-1/2 -translate-y-1/2' />
          <p className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 px-2 text-sm text-muted-foreground bg-background'>
            Or continue with
          </p>
        </div>

        <Form {...form}>
          <form
            id='form-signup'
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col space-y-4'
          >
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='wick_21' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='wick@example.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>

      <CardFooter className='flex-col items-start w-full space-y-4'>
        <Button
          type='submit'
          form='form-signup'
          loading={isSubmitting}
          className='w-full'
        >
          Continue
        </Button>
        <div className='text-sm flex items-center space-x-2 text-muted-foreground'>
          <p>Have an account?</p>{' '}
          <Link
            href='/login'
            className='hover:no-underline hover:text-foreground'
          >
            Log in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
