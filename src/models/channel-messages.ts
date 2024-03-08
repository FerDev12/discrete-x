import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { uuid as uuidv4 } from 'uuidv4';
import { members } from './members';
import { channels } from './channels';
import { servers } from './servers';
import { relations } from 'drizzle-orm';

export const channelMessages = pgTable('channel_messages', {
  id: uuid('id').primaryKey().$defaultFn(uuidv4),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),

  senderId: uuid('sender_id').references(() => members.id, {
    onDelete: 'set null',
  }),
  channelId: uuid('channel_id')
    .references(() => channels.id, { onDelete: 'cascade' })
    .notNull(),
  serverId: uuid('server_id')
    .references(() => servers.id, { onDelete: 'cascade' })
    .notNull(),
});

export const channelMessagesRelations = relations(
  channelMessages,
  ({ one }) => ({
    sender: one(members, {
      fields: [channelMessages.senderId],
      references: [members.id],
    }),
    channel: one(channels, {
      fields: [channelMessages.channelId],
      references: [channels.id],
    }),
    server: one(servers, {
      fields: [channelMessages.serverId],
      references: [servers.id],
    }),
  })
);

export type ChannelMessage = typeof channelMessages.$inferSelect;
export type NewChannelMessage = typeof channelMessages.$inferInsert;
