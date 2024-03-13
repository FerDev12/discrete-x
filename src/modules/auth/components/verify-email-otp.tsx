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
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface VerifyEmailOTPFormProps {
  email: string;
  handleVerification: (values: VerifyEmailFormType) => Promise<void>;
  onCancel: () => void;
  authResource: any;
}

const verifyEmailFormSchema = z.object({
  code: z.string().length(6, { message: 'code must be 6 digits long.' }),
});

type VerifyEmailFormType = z.infer<typeof verifyEmailFormSchema>;

export function VerifyEmailOTPForm({
  email,
  authResource,
  handleVerification,
  onCancel,
}: VerifyEmailOTPFormProps) {
  const [isLoading, setIsLoading] = useState(false);
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

  const loading = isLoading || isSubmitting;

  const resendCode = async () => {
    if (loading) return;

    setIsLoading(true);
    try {
      await authResource.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
      toast.success(
        <p>
          Code sent to <span className='underline font-semibold'>{email}</span>
        </p>
      );
    } catch (err: any) {
      toast.error(err.errors[0].message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
        <CardDescription>
          Enter the verification code sent to: <br />
          <span className='font-bold underline'>{email}</span>
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

      <CardFooter className='flex-col space-y-4'>
        <div className='flex items-center justify-between w-full'>
          <Button variant='ghost' disabled={isSubmitting} onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type='submit'
            form='form-verify_email_otp'
            loading={isSubmitting}
            disabled={loading}
          >
            Verify
          </Button>
        </div>
        <p className='text-sm'>
          Did not receive a code?{' '}
          <Button
            type='button'
            variant='link'
            onClick={resendCode}
            loading={isLoading}
            disabled={loading}
            className='hover:no-underline hover:font-medium px-0'
          >
            Click here
          </Button>{' '}
        </p>
      </CardFooter>
    </Card>
  );
}
