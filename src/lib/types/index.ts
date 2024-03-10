import { NeonHttpQueryResultHKT } from 'drizzle-orm/neon-http';
import { PgTransaction } from 'drizzle-orm/pg-core';
import * as schema from '@/models';
import { ExtractTablesWithRelations } from 'drizzle-orm';

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
