import { defineConfig } from 'drizzle-kit';

const { NEON_DB_URL: DB_URL } = process.env;

export default defineConfig({
  schema: './src/models',
  driver: 'pg',
  dbCredentials: {
    connectionString: DB_URL!,
  },
  verbose: true,
  strict: true,
});
