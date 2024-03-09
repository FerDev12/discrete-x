'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PasswordInput } from './password-input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { OTPInput } from 'input-otp';
import {
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Fragment } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { toast } from 'sonner';

const restorePasswordFormSchema = z.object({
  code: z.string().length(6, { message: 'Code must be 6 digits long.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(new RegExp(/\d/), {
      message: 'Password must include at least 1 numeric character.',
    }),
  confirmPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(new RegExp(/\d/), {
      message: 'Confirm password must include at least 1 numeric character.',
    }),
});

type RestorePasswordFormType = z.infer<typeof restorePasswordFormSchema>;

interface RestorePasswordProps {
  email: string;
}

export function RestorePassword({ email }: RestorePasswordProps) {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const form = useForm<RestorePasswordFormType>({
    resolver: zodResolver(restorePasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onRestore = async (values: RestorePasswordFormType) => {
    if (isSubmitting || !isLoaded) return;

    if (values.password !== values.confirmPassword) {
      (
        ['password', 'confirmPassword'] as ('password' | 'confirmPassword')[]
      ).forEach((input) =>
        form.setError(input, { message: 'Passwords do not match' })
      );
      return;
    }

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        password: values.password,
        code: values.code,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/');
      }
    } catch (err: any) {
      toast.error(err.errors[0].message);
    }
  };

  const onCancelRestore = async () => {
    router.push(`?${new URLSearchParams({ successfulCreation: 'false' })}`);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <Card className='max-w-sm w-full shadow-md'>
      <CardHeader>
        <CardTitle>Create new password</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            id='form-restore_password'
            onSubmit={handleSubmit(onRestore)}
            className='flex flex-col space-y-4'
          >
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
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
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <OTPInput
                      maxLength={6}
                      render={({ slots }) => (
                        <InputOTPGroup>
                          {slots.map((slot, index) => (
                            <Fragment key={index}>
                              <InputOTPSlot {...slot} />
                              {index === 2 && <InputOTPSeparator />}
                            </Fragment>
                          ))}
                        </InputOTPGroup>
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the verification code sent to {email}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>

      <CardFooter className='justify-end'>
        <Button
          variant='ghost'
          disabled={isSubmitting}
          onClick={onCancelRestore}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          form='form-restore_password'
          loading={isSubmitting}
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
