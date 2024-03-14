import { pool } from '@/database';
import { UserRepository } from '@/modules/users/repository';
import { ServerRepository } from '../repository';
import { randomBytes, randomUUID } from 'crypto';

const userIdentifier = randomBytes(4).toString('hex');
let testUserId = '';
const testUserData = {
  userId: userIdentifier,
  username: userIdentifier,
  email: userIdentifier + '@test.com',
  password: 'password',
};

const serverIdentifier = randomBytes(4).toString('hex');
let testServerId = '';
const testServerData = {
  name: serverIdentifier,
  description: 'Testing server',
  imageUrl: 'https://image.test.jpg',
};

const newServerImageUrl = 'https://new-image.test.jpg';

const userRepo = new UserRepository();
const serverRepo = new ServerRepository();

async function cleanUp() {
  try {
    // Delete created user
    await userRepo.deleteUserByUserId(testUserId);
    // Delete created server
    if (testServerId) {
      const createdServer = await serverRepo.getServerById(testServerId);
      if (createdServer) {
        await serverRepo.deleteServerById(createdServer.id);
      }
    }
  } catch (err: any) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

beforeAll(async () => {
  // Create a test user and store it's id reference
  const user = await userRepo.createUser(testUserData);
  testUserId = user.id;
});

afterAll(async () => {
  await cleanUp();
});

describe('Server module', () => {
  it('creates a server', async () => {
    const server = await serverRepo.createServer({
      ...testServerData,
      userId: testUserId,
    });

    testServerId = server.id;

    expect(server).not.toBeUndefined();
    expect(server.userId).toBe(testUserId);
  });

  it('updates a server', async () => {
    expect(testServerId).not.toBeUndefined();

    const server = await serverRepo.getServerById(testServerId);

    expect(server).not.toBeUndefined();

    const updatedServer = await serverRepo.updateServer(testServerId, {
      imageUrl: newServerImageUrl,
    });

    expect(updatedServer.imageUrl).toBe(newServerImageUrl);
  });

  it('deletes a server', async () => {
    const server = await serverRepo.getServerById(testServerId);

    expect(server).not.toBeUndefined();

    await serverRepo.deleteServerById(testServerId);

    const deletedServer = await serverRepo.getServerById(testServerId);
    expect(deletedServer).toBeUndefined();
    testServerId = '';
  });

  it('failes to create a server for a non existent user', async () => {
    const fakeUserId = randomUUID();
    try {
      await serverRepo.createServer({
        userId: fakeUserId,
        ...testServerData,
      });
    } catch (err: any) {}

    const fakeUserServers = await serverRepo.getServersByUserId(fakeUserId);
    expect(fakeUserServers.length).toBe(0);
  });
});
