import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { uuid as uuidv4 } from 'uuidv4';
import { members } from './members';
import { relations } from 'drizzle-orm';
import { servers } from './servers';

export const directMessages = pgTable('direct_messages', {
  id: uuid('id').primaryKey().$defaultFn(uuidv4),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),

  senderId: uuid('sender_id').references(() => members.id, {
    onDelete: 'set null',
  }),
  receiverId: uuid('receiver_id').references(() => members.id, {
    onDelete: 'set null',
  }),
  serverId: uuid('server_id')
    .references(() => servers.id, { onDelete: 'cascade' })
    .notNull(),
});

export const directMessagesRelations = relations(directMessages, ({ one }) => ({
  sender: one(members, {
    fields: [directMessages.senderId],
    references: [members.id],
  }),
  receiver: one(members, {
    fields: [directMessages.receiverId],
    references: [members.id],
  }),
  server: one(servers, {
    fields: [directMessages.serverId],
    references: [servers.id],
  }),
}));

export type DirectMessage = typeof directMessages.$inferSelect;
export type NewDirectMessage = typeof directMessages.$inferInsert;
