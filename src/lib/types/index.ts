import { NeonHttpQueryResultHKT } from 'drizzle-orm/neon-http';
import { PgTransaction } from 'drizzle-orm/pg-core';
import * as schema from '@/database/schema';
import { ExtractTablesWithRelations, KnownKeysOnly } from 'drizzle-orm';

export type QueryConfig = {
  tx?: Transaction;
  relations?: string[];
};

export type Schema = typeof schema;

export type Transaction = PgTransaction<
  NeonHttpQueryResultHKT,
  Schema,
  ExtractTablesWithRelations<Schema>
>;

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export type WithQuery<T = any> = {
  columns?: {
    [K in keyof Partial<T>]?: boolean;
  };
  relations?: {
    [key: string]: boolean;
  };
};
