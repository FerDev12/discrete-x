import { pgEnum } from 'drizzle-orm/pg-core';

export const fileType = pgEnum('file_type', ['image', 'video', 'gif', 'pdf']);
export const memberRole = pgEnum('member_role', [
  'admin',
  'moderator',
  'member',
]);
export const channelType = pgEnum('channel_type', ['text', 'audio', 'video']);
