import { pgTable, primaryKey, unique, uuid } from 'drizzle-orm/pg-core';
import { servers } from '.';
import { tags } from './tags';
import { relations } from 'drizzle-orm';

export const serverTags = pgTable(
  'server_tags',
  {
    serverId: uuid('server_id')
      .references(() => servers.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    tagId: uuid('tag_id')
      .references(() => tags.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.serverId, t.tagId] }),
  })
);

export const serverTagsRelations = relations(serverTags, ({ one }) => ({
  server: one(servers, {
    fields: [serverTags.serverId],
    references: [servers.id],
  }),
  tag: one(tags, { fields: [serverTags.tagId], references: [tags.id] }),
}));

export type ServerTag = typeof serverTags.$inferSelect;
export type NewServerTag = typeof serverTags.$inferInsert;
