import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { uuid as uuidv4 } from 'uuidv4';
import { fileType } from './enums';

export const files = pgTable('files', {
  id: uuid('id').primaryKey().$defaultFn(uuidv4),
  url: text('url').notNull(),
  type: fileType('type').notNull().default('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type File = typeof files.$inferSelect;
export type NewFiel = typeof files.$inferInsert;
