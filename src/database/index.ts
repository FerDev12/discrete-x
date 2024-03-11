import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@/models';

const { NODE_ENV: ENV, NEON_DB_URL_DEV, NEON_DB_URL_PROD } = process.env;
const DB_URL = ENV === 'production' ? NEON_DB_URL_PROD : NEON_DB_URL_DEV;

if (ENV === 'test') {
  neonConfig.webSocketConstructor = ws;
}

export const pool = new Pool({
  connectionString: DB_URL,
  connectionTimeoutMillis: 2000,
  max: 20,
});

export const db = drizzle(pool, { schema });
