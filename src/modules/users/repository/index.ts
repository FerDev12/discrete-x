import { db } from '@/database';
import {
  NewUser,
  PartialUser,
  User,
  files,
  userImages,
  users,
} from '@/database/schema';
import { WithQuery } from '@/lib/types';
import { eq } from 'drizzle-orm';

export class UserRepository {
  async getUserById(id: string, query?: WithQuery<User>) {
    return await db.query.users.findFirst({
      columns: query?.columns,
      where: eq(users.id, id),
      with: query?.relations,
    });
  }

  async getUserByUserId(userId: string, query?: WithQuery<User>) {
    return await db.query.users.findFirst({
      columns: query?.columns,
      where: eq(users.userId, userId),
      with: query?.relations,
    });
  }

  async createUser(data: NewUser) {
    return await db.transaction(async (tx) => {
      const [user] = await tx.insert(users).values(data).returning();

      if (user.imageUrl) {
        const [file] = await tx
          .insert(files)
          .values({
            url: user.imageUrl,
            type: 'image',
          })
          .returning();
        await tx.insert(userImages).values({
          fileId: file.id,
          userId: user.id,
        });
      }

      return user;
    });
  }

  async updateUser(id: string, data: PartialUser) {
    return await db.transaction(async (tx) => {
      const [user] = await tx
        .update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning();

      const userImage = await tx.query.userImages.findFirst({
        where: eq(userImages.userId, user.id),
        with: {
          image: true,
        },
      });

      if (!user.imageUrl && !userImage) {
        return user;
      }

      if (!user.imageUrl && userImage) {
        await tx.delete(userImages).where(eq(userImages.userId, user.id));
      }

      if (user.imageUrl && !userImage) {
        const [file] = await tx
          .insert(files)
          .values({
            url: user.imageUrl,
            type: 'image',
          })
          .returning();
        await tx.insert(userImages).values({
          fileId: file.id,
          userId: user.id,
        });
      }

      if (user.imageUrl === userImage?.image.url) {
        return user;
      }

      if (user.imageUrl && userImage && user.imageUrl !== userImage.image.url) {
        await tx
          .update(files)
          .set({
            url: user.imageUrl,
          })
          .where(eq(files.id, userImage?.fileId));
      }

      return user;
    });
  }

  async deleteUserByUserId(id: string) {
    return await db.transaction(async (tx) => {
      return await tx.delete(users).where(eq(users.id, id)).returning();
    });
  }
}
