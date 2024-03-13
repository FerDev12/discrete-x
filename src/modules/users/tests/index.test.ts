import { users } from '@/models';
import { deleteUserByUserId, upsertUser } from '../actions/server';
import { clerkClient } from '@clerk/nextjs';
import { db, pool } from '@/database';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

let clerkUserId = '';
const username = 'test';
const emailAddress = 'test+clerk_test@test.com';
const newEmailAddress = 'test2+clerk_test@test.com';
const password = randomBytes(16).toString('hex');

afterAll(async () => {
  try {
    if (clerkUserId) {
      await Promise.all([
        clerkClient.users.deleteUser(clerkUserId),
        db.delete(users).where(eq(users.userId, clerkUserId)),
      ]);
    }
  } catch (err: any) {
    console.error(err);
  } finally {
    await pool.end();
  }
});

describe('User module', () => {
  it('Rollbacks a transaction when an error is thrown', async () => {
    const email = 'pancho+clerk_test@test.com';
    const username = 'pancho';
    const userId = '1234';

    try {
      await db.transaction(async (tx) => {
        await tx.insert(users).values({
          email,
          username,
          userId,
        });

        const user = await tx.query.users.findFirst({
          where: eq(users.userId, userId),
        });
        expect(user).not.toBe(undefined);
        expect(user?.userId).toBe(userId);

        // This error is meant to rollback the transaction, do not remove
        throw new Error('Ooops!');
      });
    } catch (err: any) {
      const user = await db.query.users.findFirst({
        where: eq(users.userId, userId),
      });
      expect(user).toBe(undefined);
    }
  });

  it('Successfully creates a user', async () => {
    // Create clerk test user
    try {
      const clerkUser = await clerkClient.users.createUser({
        username,
        password,
        emailAddress: [emailAddress],
      });

      clerkUserId = clerkUser.id;
      // Retrieve user Id
      // Call upsertUser(id) and insert the user id from clerk
      await upsertUser(clerkUserId);

      const dbUser = await db.query.users.findFirst({
        columns: {
          userId: true,
        },
        where: eq(users.userId, clerkUserId),
      });

      expect(dbUser).not.toBe(undefined);
      expect(dbUser?.userId).toBe(clerkUserId);
    } catch (err: any) {
      fail(err);
    }
  });

  it('Successfully updates a user email address', async () => {
    try {
      if (!clerkUserId) {
        return fail('Clerk user Id is empty');
      }

      let dbUser = await db.query.users.findFirst({
        columns: {
          email: true,
          userId: true,
        },
        where: eq(users.userId, clerkUserId),
      });

      if (!dbUser) {
        return fail('User not found');
      }

      expect(dbUser.email).toBe(emailAddress);

      await clerkClient.emailAddresses.createEmailAddress({
        emailAddress: newEmailAddress,
        userId: dbUser.userId,
        verified: true,
        primary: true,
      });

      await upsertUser(dbUser.userId);

      dbUser = await db.query.users.findFirst({
        columns: {
          userId: true,
          email: true,
        },
        where: eq(users.userId, clerkUserId),
      });

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
      if (!clerkUserId) {
        return fail('Clerk user Id is empty');
      }

      const dbUser = await db.query.users.findFirst({
        where: eq(users.userId, clerkUserId),
      });

      if (!dbUser) {
        return fail('User not found');
      }

      await deleteUserByUserId(dbUser.userId);
      const deletedUser = await db.query.users.findFirst({
        columns: {
          userId: true,
        },
        where: eq(users.userId, clerkUserId),
      });

      expect(deletedUser).toBe(undefined);
    } catch (err: any) {
      fail(err);
    }
  });
});
