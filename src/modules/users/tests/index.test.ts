import { users } from '@/models';
import { deleteUserByUserId, upsertUser } from '../actions/server';
import { clerkClient } from '@clerk/nextjs';
import { db, pool } from '@/database';

let clerkUserId = '';
const username = 'test';
const emailAddress = 'test+clerk_test@test.com';
const newEmailAddress = 'test2+clerk_test@test.com';
const password = 'elixir_test123ac';

beforeAll(async () => {
  try {
    await db.delete(users);
  } catch (err: any) {
    console.error(err);
  }
});

afterAll(async () => {
  try {
    if (clerkUserId) {
      await clerkClient.users.deleteUser(clerkUserId);
    }
    await db.delete(users);
  } catch (err: any) {
    console.error(err);
  } finally {
    await pool.end();
  }
});

describe('User module', () => {
  it('Rollbacks a transaction when an error is thrown', async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.insert(users).values({
          username: 'pancho',
          email: 'pancho@test.com',
          userId: '1234',
        });

        const user = await tx.query.users.findFirst();
        expect(user?.username).toBe('pancho');
        throw new Error('Ooops!');
      });
    } catch (err: any) {
    } finally {
      const users = await db.query.users.findFirst();
      expect(users).toBe(undefined);
    }
  });

  it('Successfully creates a user', async () => {
    // Create clerk test user

    try {
      let dbUser = await db.query.users.findFirst();

      expect(dbUser).toBe(undefined);

      const clerkUser = await clerkClient.users.createUser({
        username,
        password,
        emailAddress: [emailAddress],
        publicMetadata: {
          test: true,
        },
      });

      clerkUserId = clerkUser.id;
      // Retrieve user Id
      // Call upsertUser(id) and insert the user id from clerk
      await upsertUser(clerkUserId);

      dbUser = await db.query.users.findFirst();

      expect(dbUser?.id).not.toBe(undefined);
    } catch (err: any) {
      fail(err);
    }
  });

  it('Successfully updates a user email address', async () => {
    try {
      let dbUser = await db.query.users.findFirst();

      if (!dbUser) {
        throw new Error('User not found');
      }

      expect(dbUser.email).toBe(emailAddress);

      await clerkClient.emailAddresses.createEmailAddress({
        emailAddress: newEmailAddress,
        userId: dbUser.userId,
        verified: true,
        primary: true,
      });

      await upsertUser(dbUser.userId);

      dbUser = await db.query.users.findFirst();

      if (!dbUser) {
        throw new Error('User not found');
      }

      expect(dbUser.email).toBe(newEmailAddress);
    } catch (err: any) {
      fail(err);
    }
  });

  it('Successfully deletes a user', async () => {
    try {
      const dbUser = await db.query.users.findFirst();

      if (!dbUser) {
        throw new Error('User not found');
      }

      await deleteUserByUserId(dbUser.userId);
      const deletedUser = await db.query.users.findFirst();

      expect(deletedUser).toBe(undefined);
    } catch (err: any) {
      fail(err);
    }
  });
});
