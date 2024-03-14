import 'server-only';

import { clerkClient } from '@clerk/nextjs';
import { UserRepository } from '../../repository';
import { UUID } from '@/lib/types';

export async function deleteUserByUserId(userId: string) {
  const userRepo = new UserRepository();

  const dbUser = await userRepo.getUserByUserId(userId, {
    columns: {
      id: true,
    },
  });

  if (dbUser) {
    await userRepo.deleteUserByUserId(dbUser.id as UUID);
  }
}

export async function upsertUser(userId: string) {
  const user = await clerkClient.users.getUser(userId);

  if (!user || !user.username) {
    return;
  }

  const email = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress;

  if (!email) return;

  const userRepo = new UserRepository();

  const dbUser = await userRepo.getUserByUserId(user.id, {
    columns: {
      id: true,
    },
  });

  if (dbUser) {
    await userRepo.updateUser(dbUser.id as UUID, {
      username: user.username,
      email,
      imageUrl: user.imageUrl,
    });
  } else {
    await userRepo.createUser({
      userId: user.id,
      email,
      username: user.username,
      imageUrl: user.imageUrl,
    });
  }
}
