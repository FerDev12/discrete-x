import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { uuid as uuidv4 } from 'uuidv4';
import { files } from './files';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().$defaultFn(uuidv4),
  username: text('username').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),

  // Relationships
  imageId: uuid('image_id').references(() => files.id, {
    onDelete: 'set null',
  }),
});

export const usersRelationships = relations(users, ({ one }) => ({
  image: one(files, { fields: [users.imageId], references: [files.id] }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
