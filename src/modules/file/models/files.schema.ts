import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const fileType = pgEnum('file_type', ['image', 'video', 'pdf', 'gif']);

export const files = pgTable('files', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  url: text('url').notNull(),
  type: fileType('type').notNull().default('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
