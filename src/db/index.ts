import * as schema from './schema';
import * as relations from './relations';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { env } from '@/env';

const sql = neon(env.DATABASE_URL);
export const db = drizzle({ client: sql, schema: { ...schema, ...relations }, casing: 'snake_case' });
