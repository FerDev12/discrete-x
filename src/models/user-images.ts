import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { files, users } from '.';
import { relations } from 'drizzle-orm';

export const userImages = pgTable(
  'user_images',
  {
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .unique()
      .notNull(),
    fileId: uuid('file_ID')
      .references(() => files.id, {
        onDelete: 'cascade',
      })
      .unique()
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.fileId, t.userId] }),
  })
);

export const userImagesRelations = relations(userImages, ({ one }) => ({
  user: one(users, { fields: [userImages.userId], references: [users.id] }),
  image: one(files, { fields: [userImages.fileId], references: [files.id] }),
}));

export type UserImage = typeof userImages.$inferSelect;
export type NewUserImage = typeof userImages.$inferInsert;
