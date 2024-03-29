import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema';

const { NODE_ENV: ENV, NEON_DB_URL: DB_URL } = process.env;

if (ENV === 'test') {
  neonConfig.webSocketConstructor = ws;
}

const max = ENV === 'test' ? 1 : 20;

export const pool = new Pool({
  connectionString: DB_URL,
  connectionTimeoutMillis: 2000,
  max,
});

export const db = drizzle(pool, { schema });
