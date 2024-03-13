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
import { cn } from '@/lib/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { OTPInput } from 'input-otp';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface VerifyEmailOTPFormProps {
  email: string;
  handleVerification: (values: VerifyEmailFormType) => Promise<void>;
  onCancel: () => void;
}

const verifyEmailFormSchema = z.object({
  code: z.string().length(6, { message: 'code must be 6 digits long.' }),
});

type VerifyEmailFormType = z.infer<typeof verifyEmailFormSchema>;

export function VerifyEmailOTPForm({
  email,
  handleVerification,
  onCancel,
}: VerifyEmailOTPFormProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
        <CardDescription>
          Enter the verification code sent to: <br />
          <span className='font-medium'>{email}</span>
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
                      data-testid='otp-code'
                      maxLength={6}
                      render={({ slots }) => (
                        <InputOTPGroup>
                          {slots.map((slot, index) => (
                            <Fragment key={index}>
                              <InputOTPSlot
                                {...slot}
                                className={cn(index === 3 && 'border-l')}
                              />
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

      <CardFooter className='justify-between'>
        <Button variant='ghost' disabled={isSubmitting} onClick={onCancel}>
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
