import {
  pgTable,
  uniqueIndex,
  text,
  timestamp,
  boolean,
  serial,
  varchar,
  integer,
  jsonb,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';
import {  sql } from 'drizzle-orm';
import { SCAN_JOB_STATUS } from '@/utils/constants';

// === ENUMS ===
export const statusEnum = pgEnum('scan_job_status', SCAN_JOB_STATUS);

// === AUTH SCHEMA ===

export const users = pgTable(
  'users',
  {
    id: text()
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    name: text().notNull(),
    email: text().notNull(),
    emailVerified: boolean().default(false).notNull(),
    image: text(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex('users_email_key').on(table.email)]
);

export const accounts = pgTable(
  'accounts',
  {
    id: text()
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp(),
    refreshTokenExpiresAt: timestamp(),
    scope: text(),
    password: text(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('accounts_provider_account_id_key').on(table.providerId, table.accountId),
    index('accounts_user_id_idx').on(table.userId),
  ]
);

export const sessions = pgTable(
  'sessions',
  {
    id: text().primaryKey().notNull(),
    expiresAt: timestamp().notNull(),
    token: text().notNull(),
    userId: text(),
    ipAddress: text(),
    userAgent: text(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex('sessions_token_key').on(table.token), index('sessions_user_id_idx').on(table.userId)]
);

export const verifications = pgTable(
  'verifications',
  {
    id: text()
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex('verifications_identifier_value_key').on(table.identifier, table.value)]
);

// === APP SCHEMA ===

export const newsletters = pgTable(
  'newsletters',
  {
    id: text()
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    name: text().notNull(),
    address: text().notNull().unique(),
    faviconUrl: text(),
    unsubscribeUrl: text(),
    rssUrl: text(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('newsletters_address_idx').on(table.address)]
);

export const scanJobs = pgTable(
  'scan_jobs',
  {
    id: serial().primaryKey(),
    userId: text(),
    status: statusEnum(),
    emailsProcessedCount: integer().notNull().default(0),
    totalEmailsToScan: integer().notNull().default(0),
    inboxTotalEmails: integer().notNull().default(0),
    scanDepth: varchar({ length: 50 }).default("'standard'"),
    smartFiltering: boolean().default(true),
    categories: jsonb().default(
      sql`'{"primary": true, "promotions": true, "social": false, "updates": false, "forums": false}'::jsonb`
    ),
    newslettersFoundCount: integer().notNull().default(0),
    currentPageToken: text(),
    discoveredNewsletters: jsonb()
      .$type<Newsletter[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    result: jsonb().$type<Newsletter[]>(),
    error: text(),
    startedAt: timestamp(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    completedAt: timestamp(),
  },
  (table) => [
    index('scan_jobs_user_id_idx').on(table.userId),
    index('scan_jobs_status_idx').on(table.status),
    uniqueIndex('scan_jobs_active_user_constraint')
      .on(table.userId)
      .where(sql`${table.status} NOT IN ('COMPLETED', 'FAILED', 'CANCELLED')`),
  ]
);

// === TYPE EXPORTS ===

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Newsletter = typeof newsletters.$inferSelect;
export type NewNewsletter = typeof newsletters.$inferInsert;

export type ScanJob = typeof scanJobs.$inferSelect;
export type NewScanJob = typeof scanJobs.$inferInsert;
