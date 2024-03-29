import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { servers } from './servers.schema';
import { files } from '../../file/models/index.schema';
import { relations } from 'drizzle-orm';

export const serverImages = pgTable('server_images', {
  serverId: uuid('server_id')
    .references(() => servers.id, { onDelete: 'cascade' })
    .notNull(),
  fileId: uuid('file_id')
    .references(() => files.id, { onDelete: 'cascade' })
    .notNull(),
});

export const serverImagesRelations = relations(serverImages, ({ one }) => ({
  server: one(servers, {
    fields: [serverImages.serverId],
    references: [servers.id],
  }),
  file: one(files, { fields: [serverImages.fileId], references: [files.id] }),
}));

export type ServerImage = typeof serverImages.$inferSelect;
export type NewServerImage = typeof serverImages.$inferInsert;
