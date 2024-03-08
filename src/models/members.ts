import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { uuid as uuidv4 } from 'uuidv4';
import { users } from './users';
import { servers } from './servers';
import { memberRole } from './enums';

export const members = pgTable('members', {
  id: uuid('id').primaryKey().$defaultFn(uuidv4),
  role: memberRole('role').notNull().default('member'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),

  // Relationships
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  serverId: uuid('server_id')
    .references(() => servers.id, { onDelete: 'cascade' })
    .notNull(),
});

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
