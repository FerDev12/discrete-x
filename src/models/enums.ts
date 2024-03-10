import { pgEnum } from 'drizzle-orm/pg-core';

export const fileType = pgEnum('file_type', ['image', 'video', 'gif', 'pdf']);
