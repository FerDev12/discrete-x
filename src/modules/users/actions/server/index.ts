import 'server-only';
import { getDB } from '@/database';
import { files, userImages, users } from '@/models';
import { eq } from 'drizzle-orm';
import { clerkClient } from '@clerk/nextjs';

export async function deleteUserByUserId(userId: string) {
  const { db, pool } = getDB();
  try {
    await db.delete(users).where(eq(users.userId, userId));
  } finally {
    pool.end();
  }
}

export async function upsertUser(userId: string) {
  const { db, pool } = getDB();
  try {
    const user = await clerkClient.users.getUser(userId);

    if (!user || !user.username) {
      return;
    }

    const email = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (!email) return;

    await db.transaction(async (tx) => {
      // Upsert user
      const [dbUser] = await tx
        .insert(users)
        .values({
          userId: user.id,
          username: user.username!,
          email: email,
        })
        .onConflictDoUpdate({
          target: users.userId,
          set: {
            username: user.username!,
            email: email,
          },
        })
        .returning();

      // Query for existing user image
      const dbUserImage = await tx.query.userImages.findFirst({
        where: eq(userImages.userId, dbUser.id),
        with: {
          image: true,
        },
      });

      if (!dbUserImage) {
        // Create file
        const [file] = await tx
          .insert(files)
          .values({
            url: user.imageUrl,
            type: 'image',
          })
          .returning();
        // Create user image
        await tx.insert(userImages).values({
          userId: dbUser.id,
          fileId: file.id,
        });
      } else {
        if (dbUserImage.image?.url === user.imageUrl) {
          // If user image exists and has the same url as passed in imageUrl return
          return;
        }

        // Update image file url
        await tx
          .update(files)
          .set({ url: user.imageUrl })
          .where(eq(files.id, dbUserImage.fileId));
      }
    });
  } finally {
    pool.end();
  }
}
