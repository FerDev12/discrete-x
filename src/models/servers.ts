import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { relations, sql } from 'drizzle-orm';
import { files } from './files';
import { tags } from './tags';

export const servers = pgTable('servers', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  name: text('name').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),

  // References
  ownerId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  imageId: uuid('image_id')
    .references(() => files.id)
    .notNull(),
});

export const serversRelations = relations(servers, ({ one, many }) => ({
  owner: one(users, { fields: [servers.ownerId], references: [users.id] }),
  image: one(files, { fields: [servers.imageId], references: [files.id] }),
  tags: many(tags),
}));

export type Server = typeof servers.$inferSelect;
export type NewServer = typeof servers.$inferInsert;
