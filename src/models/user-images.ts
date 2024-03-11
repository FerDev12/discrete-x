import { pgTable, primaryKey, unique, uuid } from 'drizzle-orm/pg-core';
import { files, users } from '.';
import { relations, sql } from 'drizzle-orm';

export const userImages = pgTable(
  'user_images',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    fileId: uuid('file_ID')
      .references(() => files.id, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
  (t) => ({
    unq: unique().on(t.userId, t.fileId),
  })
);

export const userImagesRelations = relations(userImages, ({ one }) => ({
  user: one(users, { fields: [userImages.userId], references: [users.id] }),
  image: one(files, { fields: [userImages.fileId], references: [files.id] }),
}));

export type UserImage = typeof userImages.$inferSelect;
export type NewUserImage = typeof userImages.$inferInsert;
