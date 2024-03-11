import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@/models';

const ENV = process.env.NODE_ENV;
const DB_URL =
  ENV === 'development'
    ? process.env.NEON_DB_URL_DEV
    : ENV === 'test'
    ? process.env.NEON_DB_URL_TEST
    : process.env.NEON_DB_URL_PROD;

neonConfig.webSocketConstructor = ws;

export function getDB() {
  const pool = new Pool({
    connectionString: DB_URL,
    connectionTimeoutMillis: 1000,
  });
  pool.connect();
  const db = drizzle(pool, { schema });
  return { db, pool };
}
