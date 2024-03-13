'use server';

import { db } from '@/database';
import { InternalServerError } from '@/errors/internal-server-error';
import { NotFoundError } from '@/errors/not-found-error';
import { UnauthenticatedError } from '@/errors/unauthenticated-error';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { ValidationError } from '@/errors/validation-error';
import { UUID } from '@/lib/types';
import { tryCatch } from '@/lib/utils/try-catch';
import { files, serverImages, servers, users } from '@/models';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const createServerShema = z.object({
  name: z
    .string({ required_error: 'You must give your server a name.' })
    .min(2, { message: 'Server name must be at least two characters long.' }),
  description: z
    .string()
    .min(1, { message: 'You must give your server a small description.' })
    .max(64, {
      message: 'Keep your server description below 64 characters long.',
    }),
  private: z.boolean().default(false).optional(),
  imageUrl: z.string().url().optional(),
});

export async function createServer(data: z.infer<typeof createServerShema>) {
  return await tryCatch(async () => {
    // Authenticate request & extract userId
    const { userId } = auth(); // FIXME: Is causing testing errors
    if (!userId) {
      throw new UnauthenticatedError();
    }

    const dbUser = await db.query.users.findFirst({
      columns: {
        id: true,
      },
      where: eq(users.userId, userId),
    });

    if (!dbUser) {
      throw new NotFoundError('User not found.');
    }

    // Validate data
    const dataRes = createServerShema.safeParse(data);

    if (!dataRes.success) {
      throw new ValidationError(dataRes.error);
    }

    const {
      name,
      description,
      imageUrl,
      private: privateServer,
    } = dataRes.data;

    // Create server
    const server = await db.transaction(async (tx) => {
      const [server] = await tx
        .insert(servers)
        .values({
          userId: dbUser.id,
          name,
          description,
          imageUrl,
          private: privateServer,
        })
        .returning();

      if (imageUrl) {
        const [file] = await tx
          .insert(files)
          .values({
            url: imageUrl,
            type: 'image',
          })
          .returning();
        await tx.insert(serverImages).values({
          serverId: server.id,
          fileId: file.id,
        });

        return server;
      }
    });

    if (!server) {
      throw new InternalServerError();
    }

    return server;
  });
}

const updateServerSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 character long' })
    .optional(),
  description: z
    .string()
    .min(2, { message: 'Description must be at least 2 characters long.' })
    .optional(),
  imageUrl: z.string().url().optional(),
  private: z.boolean().optional(),
});

export async function updateServer(
  serverId: UUID,
  data: z.infer<typeof updateServerSchema>
) {
  return await tryCatch(async () => {
    const { userId } = auth();

    if (!userId) {
      throw new UnauthenticatedError();
    }

    const dbUser = await db.query.users.findFirst({
      columns: {
        id: true,
      },
      where: eq(users.userId, users.id),
    });

    if (!dbUser) {
      throw new NotFoundError('User not found.');
    }

    const dbServer = await db.query.servers.findFirst({
      where: eq(servers.id, serverId),
    });

    if (!dbServer) {
      throw new NotFoundError('Server not found.');
    }

    if (dbServer.userId !== dbUser.id) {
      throw new UnauthorizedError();
    }

    const dataRes = updateServerSchema.safeParse(data);

    if (!dataRes.success) {
      throw new ValidationError(dataRes.error);
    }

    const updatedServer = await db.transaction(async (tx) => {
      const { data } = dataRes;

      const [updatedServer] = await tx
        .update(servers)
        .set(data)
        .where(eq(servers.id, serverId))
        .returning();

      if (dbServer.imageUrl === updatedServer.imageUrl) {
        return updatedServer;
      }

      const dbServerImage = await tx.query.serverImages.findFirst();

      if (!dbServerImage && !!data.imageUrl) {
        const [file] = await tx
          .insert(files)
          .values({
            url: data.imageUrl,
            type: 'image',
          })
          .returning();
        await tx.insert(serverImages).values({
          serverId: updatedServer.id,
          fileId: file.id,
        });

        return updatedServer;
      }

      if (dbServerImage) {
        await tx
          .update(files)
          .set({
            url: data.imageUrl,
          })
          .where(eq(files.id, dbServerImage.fileId));
      }

      return updatedServer;
    });

    if (!updatedServer) {
      throw new InternalServerError();
    }

    return updatedServer;
  });
}

export async function deleteServer(id: UUID) {
  return await tryCatch(async () => {
    const { userId } = auth();

    if (!userId) {
      throw new UnauthenticatedError();
    }

    const dbUser = await db.query.users.findFirst({
      columns: {
        id: true,
      },
      where: eq(users.userId, userId),
    });

    if (!dbUser) {
      throw new NotFoundError('User not found.');
    }

    const dbServer = await db.query.servers.findFirst({
      columns: {
        id: true,
        userId: true,
      },
      where: eq(servers.id, id),
    });

    if (!dbServer) {
      throw new NotFoundError('Server not found.');
    }

    if (dbServer.userId !== dbUser.id) {
      throw new UnauthorizedError();
    }

    await db.delete(servers).where(eq(servers.id, dbServer.id));

    return dbServer.id;
  });
}
