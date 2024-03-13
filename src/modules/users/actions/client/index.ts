'use server';

import { clerkClient } from '@clerk/nextjs';

export async function deleteAllTestUsers() {
  try {
    const users = await clerkClient.users.getUserList({
      limit: 100,
    });

    const testUsers = users.filter((usr) => {
      const primaryEmail = usr.emailAddresses.find(
        (e) => e.id === usr.primaryEmailAddressId
      );
      if (primaryEmail?.emailAddress.includes('+clerk_test@')) {
        return true;
      }
      return false;
    });

    await Promise.all(
      testUsers.map(async (usr) => await clerkClient.users.deleteUser(usr.id))
    );
  } catch (err: any) {
    console.error(err);
  }
}
