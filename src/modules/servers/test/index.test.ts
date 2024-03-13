import { db, pool } from '@/database';
import { createServer, deleteServer, updateServer } from '../actions/client';
import { UUID } from '@/lib/types';
import { eq } from 'drizzle-orm';
import { servers } from '@/models';

const data = {
  name: 'Bloom',
  description: 'Testing server',
  imageUrl: 'https://image.test.jpg',
};
const newImageUrl = 'https://new-image.test.jpg';

let serverId: UUID | null = null;

async function cleanUp() {
  try {
    //
  } catch (err: any) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

beforeAll(async () => {
  // Authenticate clerk user for subsequent requests
});

afterAll(async () => {
  await cleanUp();
});

describe('Server module', () => {
  it('Creates a server', async () => {
    const { error, data: server } = await createServer(data);

    expect(error).toBeNull();

    serverId = server?.id as UUID;
    expect(server).not.toBe(undefined);
    expect(server?.name).toBe(data.name);
  });

  it('Updates a server image', async () => {
    expect(serverId).not.toBeNull();

    const { error, data: server } = await updateServer(serverId!, {
      imageUrl: newImageUrl,
    });

    expect(error).toBeNull();

    const serverImage = await db.query.serverImages.findFirst({
      with: {
        file: true,
      },
    });

    expect(serverImage).not.toBe(undefined);

    expect(serverImage?.file.url).toBe(newImageUrl);
    expect(server).not.toBe(undefined);
    expect(server?.imageUrl).toBe(newImageUrl);
  });

  it('Deletes a server', async () => {
    expect(serverId).not.toBeNull();

    const { error } = await deleteServer(serverId!);

    expect(error).toBeNull();

    const dbServer = await db.query.servers.findFirst({
      columns: {
        id: true,
      },
      where: eq(servers.id, serverId!),
    });

    expect(dbServer).toBe(undefined);
  });
});
