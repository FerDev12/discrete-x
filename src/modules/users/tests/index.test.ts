import { users } from '@/models';
import { deleteUserByUserId, upsertUser } from '../actions/server';
import { clerkClient } from '@clerk/nextjs';
import { getDB } from '@/database';

let clerkUserId = '';
const username = 'test';
const emailAddress = 'test+clerk_test@test.com';
const newEmailAddress = 'test2+clerk_test@test.com';
const password = 'elixir_test123ac';

beforeAll(async () => {
  const { db, pool } = getDB();
  try {
    await db.delete(users);
  } catch (err: any) {
    console.error(err);
  } finally {
    pool.end();
  }
});

afterAll(async () => {
  if (clerkUserId) {
    await clerkClient.users.deleteUser(clerkUserId);
  }
  const { db, pool } = getDB();
  try {
    await db.delete(users);
  } catch (err: any) {
    console.error(err);
  } finally {
    pool.end();
  }
});

describe('User module', () => {
  it('Successfully creates a user', async () => {
    // Create clerk test user
    const { db, pool } = getDB();

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

      expect(dbUser).not.toBe(undefined);
    } catch (err: any) {
      console.error(err);
    } finally {
      pool.end();
    }
  });

  it('Successfully updates a user email address', async () => {
    const { db, pool } = getDB();
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
      console.error(err);
    } finally {
      pool.end();
    }
  });

  it('Successfully deletes a user', async () => {
    const { db, pool } = getDB();

    try {
      const dbUser = await db.query.users.findFirst();

      if (!dbUser) {
        throw new Error('User not found');
      }

      await deleteUserByUserId(dbUser.userId);
      const deletedUser = await db.query.users.findFirst();

      expect(deletedUser).toBe(undefined);
    } catch (err: any) {
      console.error(err);
    } finally {
      pool.end();
    }
  });
});
