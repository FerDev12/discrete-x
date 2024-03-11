import { defineConfig } from 'drizzle-kit';

const { NODE_ENV: ENV, NEON_DB_URL_DEV, NEON_DB_URL_PROD } = process.env;
const DB_URL = ENV === 'production' ? NEON_DB_URL_PROD : NEON_DB_URL_DEV;

export default defineConfig({
  schema: './src/models',
  driver: 'pg',
  dbCredentials: {
    connectionString: DB_URL!,
  },
  verbose: true,
  strict: true,
});
