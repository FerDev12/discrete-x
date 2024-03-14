import 'server-only';

import { db } from '@/database';
import { UUID, WithQuery } from '@/lib/types';
import { eq } from 'drizzle-orm';
import {
  files,
  servers,
  serverImages,
  NewServer,
  PartialServer,
  Server,
} from '@/database/schema';

export class ServerRepository {
  async getServerById(id: string, query?: WithQuery<Server>) {
    return await db.query.servers.findFirst({
      columns: query?.columns,
      where: eq(servers.id, id),
      with: query?.relations,
    });
  }

  async getServersByUserId(id: string, query?: WithQuery<Server>) {
    return await db.query.servers.findMany({
      columns: query?.columns,
      where: eq(servers.userId, id),
      with: query?.relations,
    });
  }

  async createServer(data: NewServer) {
    return await db.transaction(async (tx) => {
      const [server] = await tx.insert(servers).values(data).returning();

      if (server.imageUrl) {
        const [file] = await tx
          .insert(files)
          .values({
            url: server.imageUrl,
            type: 'image',
          })
          .returning();

        await tx.insert(serverImages).values({
          serverId: server.id,
          fileId: file.id,
        });
      }

      return server;
    });
  }

  async updateServer(id: string, data: PartialServer) {
    return await db.transaction(async (tx) => {
      const [server] = await tx
        .update(servers)
        .set(data)
        .where(eq(servers.id, id))
        .returning();

      const serverImage = await tx.query.serverImages.findFirst({
        where: eq(serverImages.serverId, server.id),
        with: {
          file: true,
        },
      });

      if (!serverImage && !server.imageUrl) {
        return server;
      }

      if (!serverImage && server.imageUrl) {
        const [file] = await tx
          .insert(files)
          .values({
            url: server.imageUrl,
            type: 'image',
          })
          .returning();
        await tx.insert(serverImages).values({
          serverId: server.id,
          fileId: file.id,
        });
      }

      if (serverImage && !server.imageUrl) {
        await tx
          .delete(serverImages)
          .where(eq(serverImages.serverId, server.id));
      }

      if (serverImage && serverImage.file.url === server.imageUrl) {
        return server;
      }

      if (
        server.imageUrl &&
        serverImage &&
        serverImage.file.url !== server.imageUrl
      ) {
        await tx
          .update(files)
          .set({ url: server.imageUrl })
          .where(eq(files.id, serverImage.fileId));
      }

      return server;
    });
  }

  async deleteServerById(id: string) {
    const [server] = await db
      .delete(servers)
      .where(eq(servers.id, id))
      .returning();
    return server;
  }
}
