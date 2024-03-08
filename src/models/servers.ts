import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { uuid as uuidv4 } from 'uuidv4';
import { users } from './users';
import { relations } from 'drizzle-orm';
import { files } from './files';

export const servers = pgTable('servers', {
  id: uuid('id').primaryKey().$defaultFn(uuidv4),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),

  // Relationships
  ownerId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  imageId: uuid('image_id')
    .references(() => files.id)
    .notNull(),
});

export const serversRelations = relations(servers, ({ one }) => ({
  owner: one(users, { fields: [servers.ownerId], references: [users.id] }),
  image: one(files, { fields: [servers.imageId], references: [files.id] }),
}));

export type Server = typeof servers.$inferSelect;
export type NewServer = typeof servers.$inferInsert;
