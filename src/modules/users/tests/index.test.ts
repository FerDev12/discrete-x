import { users } from '@/database/schema';
import { db, pool } from '@/database';
import { eq } from 'drizzle-orm';
import { UserRepository } from '../repository';
import { randomBytes } from 'crypto';

const identifier = randomBytes(4).toString('hex');
let testUserId = '';
const testUserData = {
  userId: identifier,
  username: identifier,
  email: identifier + '@test.com',
  password: 'password',
  imageUrl: 'http://testimage.jpg',
};
const newImageUrl = 'http://testimage2.jpg';

const userRepo = new UserRepository();

afterAll(async () => {
  try {
    if (testUserId) {
      const dbUser = await userRepo.getUserById(testUserId);
      if (!dbUser) {
        return;
      }
      await userRepo.deleteUserByUserId(dbUser.id);
    }
  } catch (err: any) {
    console.error(err);
  } finally {
    pool.end();
  }
});

describe('User module', () => {
  it('creates a user', async () => {
    const createdUser = await userRepo.createUser(testUserData);
    testUserId = createdUser.id;
    const dbUser = await userRepo.getUserById(testUserId);
    expect(dbUser).not.toBeUndefined();
  });

  it('updates a user', async () => {
    const dbUser = await userRepo.getUserById(testUserId);
    expect(dbUser).not.toBeUndefined();
    await userRepo.updateUser(testUserId, {
      imageUrl: newImageUrl,
    });
    const updatedDBUser = await userRepo.getUserById(testUserId);
    expect(updatedDBUser?.imageUrl).toBe(newImageUrl);
  });

  it('deletes a user', async () => {
    const dbUser = await userRepo.getUserById(testUserId);
    expect(dbUser).not.toBeUndefined();
    await userRepo.deleteUserByUserId(testUserId);
    const deletedDbUser = await userRepo.getUserById(testUserId);
    expect(deletedDbUser).toBeUndefined();
    testUserId = '';
  });
});
