import { defineConfig } from 'drizzle-kit';

const ENV = process.env.NODE_ENV;
const DB_URL =
  ENV === 'development'
    ? process.env.NEON_DB_URL_DEV
    : ENV === 'test'
    ? process.env.NEON_DB_URL_TEST
    : process.env.NEON_DB_URL_PROD;

export default defineConfig({
  schema: './src/models',
  driver: 'pg',
  dbCredentials: {
    connectionString: DB_URL!,
  },
  verbose: true,
  strict: true,
});
