import path from 'node:path';
import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

dotenv.config({ path: path.join(__dirname, '.env.local') });

const migrateUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL!;

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  datasource: {
    url: migrateUrl,
  },
} as Parameters<typeof defineConfig>[0]);
