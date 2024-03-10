'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSignIn } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PasswordInput } from './password-input';
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
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { Link } from '@/components/ui/link';
import { GithubOAuthButton } from './github-oauth-button';

const loginFormSchema = z.object({
  identifier: z.string(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' }),
});

type LoginFormSchemaType = z.infer<typeof loginFormSchema>;

export function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, signIn, setActive } = useSignIn();
  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const redirectUrl = searchParams.get('redirectUrl') ?? '/';

  const onLogin = async (values: LoginFormSchemaType) => {
    if (!isLoaded || isSubmitting) return;

    try {
      const result = await signIn.create(values);

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push(redirectUrl);
        return;
      }

      toast.error('Something went wrong.');
    } catch (err: any) {
      toast.error(err.errors[0].message);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <Card className='max-w-sm w-full shadow-md'>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>To continue to Discreet X</CardDescription>
      </CardHeader>

      <CardContent className='flex flex-col space-y-8'>
        <GithubOAuthButton type='login' />

        <div className='relative'>
          <Separator className='absolute inset-x-0 top-1/2 -translate-y-1/2' />
          <p className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 px-2 bg-background text-sm text-muted-foreground'>
            Or continue with
          </p>
        </div>

        <Form {...form}>
          <form
            id='form-login'
            onSubmit={handleSubmit(onLogin)}
            className='flex flex-col space-y-4'
          >
            <FormField
              control={form.control}
              name='identifier'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} />
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

            <Link
              href='/forgot-password'
              className='w-fit text-sm text-muted-foreground hover:no-underline hover:text-foreground'
            >
              Forgot password?
            </Link>
          </form>
        </Form>
      </CardContent>

      <CardFooter className='flex-col items-start space-y-4'>
        <Button
          type='submit'
          form='form-login'
          loading={isSubmitting}
          className='w-full'
        >
          Continue
        </Button>

        <div className='flex flex-col space-y-2 text-sm w-full text-muted-foreground'>
          <div className='flex items-center space-x-2'>
            <p>Don{"'"}t have an acount?</p>{' '}
            <Link
              href={`/signup?${searchParams}`}
              className='hover:no-underline hover:text-foreground'
            >
              Sign up
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
