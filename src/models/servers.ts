import { relations, sql } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { serverImages, users } from '.';

export const servers = pgTable('servers', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  private: boolean('private').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});

export const serversRelations = relations(servers, ({ one }) => ({
  admin: one(users, { fields: [servers.userId], references: [users.id] }),
  image: one(serverImages),
}));

export type Server = typeof servers.$inferSelect;
export type NewServer = typeof servers.$inferInsert;
export type PartialServer = Partial<Omit<NewServer, 'id' | 'createdAt'>>;
