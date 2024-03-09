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
import {
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { OTPInput } from 'input-otp';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface VerifyEmailOTPFormProps {
  email: string;
  handleVerification: (values: VerifyEmailFormType) => Promise<void>;
}

const verifyEmailFormSchema = z.object({
  code: z.string().length(6, { message: 'code must be 6 digits long.' }),
});

type VerifyEmailFormType = z.infer<typeof verifyEmailFormSchema>;

export function VerifyEmailOTPForm({
  email,
  handleVerification,
}: VerifyEmailOTPFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<VerifyEmailFormType>({
    resolver: zodResolver(verifyEmailFormSchema),
    defaultValues: {
      code: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const cancelVerification = () => {
    const params = Object.fromEntries(searchParams.entries());
    router.push(
      `?${new URLSearchParams({
        ...params,
        verify: 'false',
      })}`
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
        <CardDescription>
          Enter the verification code sent to: <br />
          {email}
        </CardDescription>
      </CardHeader>

      <CardContent className='flex items-center justify-center'>
        <Form {...form}>
          <form
            id='form-verify_email_otp'
            onSubmit={handleSubmit(handleVerification)}
          >
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
                          ))}{' '}
                        </InputOTPGroup>
                      )}
                      {...field}
                    />
                  </FormControl>
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
          onClick={cancelVerification}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          form='form-verify_email_otp'
          loading={isSubmitting}
        >
          Verify
        </Button>
      </CardFooter>
    </Card>
  );
}
