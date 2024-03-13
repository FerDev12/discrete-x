'use client';
import { deleteAllTestUsers } from '@/modules/users/actions/client';
import { Button } from './ui/button';
import { useState } from 'react';

export function DeleteTestUsersButton() {
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteUsers = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await deleteAllTestUsers();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={onDeleteUsers} loading={isLoading}>
      Delete Test Users
    </Button>
  );
}
