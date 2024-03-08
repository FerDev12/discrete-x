import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { uuid as uuidv4 } from 'uuidv4';
import { members } from './members';
import { servers } from './servers';
import { relations } from 'drizzle-orm';
import { channelType } from './enums';

export const channels = pgTable('channels', {
  id: uuid('id').primaryKey().$defaultFn(uuidv4),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  type: channelType('type').notNull().default('text'),

  // Relationships
  createdBy: uuid('created_by').references(() => members.id, {
    onDelete: 'set null',
  }),
  serverId: uuid('server_id')
    .references(() => servers.id, { onDelete: 'cascade' })
    .notNull(),
});

export const channelsRelations = relations(channels, ({ one }) => ({
  creator: one(members, {
    fields: [channels.createdBy],
    references: [members.id],
  }),
  server: one(servers, {
    fields: [channels.serverId],
    references: [servers.id],
  }),
}));

export type Channel = typeof channels.$inferSelect;
export type NewChannel = typeof channels.$inferInsert;
