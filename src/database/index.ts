import { NeonQueryFunction, neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/models';

const ENV = process.env.NODE_ENV;
const DB_URL =
  ENV === 'development'
    ? process.env.NEON_DB_URL_DEV
    : ENV === 'test'
    ? process.env.NEON_DB_URL_TEST
    : process.env.NEON_DB_URL_PROD;

const sql = neon(DB_URL!);
export const db = drizzle(sql as NeonQueryFunction<boolean, boolean>, {
  schema,
});
