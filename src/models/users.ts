import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { userImages } from '.';

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id').unique().notNull(),
  username: text('username').unique().notNull(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelationships = relations(users, ({ one }) => ({
  image: one(userImages),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PartialUser = Omit<Partial<User>, 'id' | 'createdAt' | 'updatedAt'>;
