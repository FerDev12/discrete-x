import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/models';

const { NODE_ENV: ENV, NEON_DB_URL_DEV, NEON_DB_URL_PROD } = process.env;
const DB_URL = ENV === 'production' ? NEON_DB_URL_PROD : NEON_DB_URL_DEV;

// if (process.env.NODE_ENV === 'test') {
//   neonConfig.webSocketConstructor = ws;
// }

export const pool = new Pool({
  connectionString: DB_URL,
  connectionTimeoutMillis: 2000,
  max: 20,
});

export const db = drizzle(pool, { schema });
