import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const tags = pgTable('tags', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen-random-uuid()`),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  tag: text('tag').unique().notNull(),
});
