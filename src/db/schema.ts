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
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// === AUTH SCHEMA ===

export const users = pgTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    name: text().notNull(),
    email: text().notNull(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text(),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex('users_email_key').on(table.email)]
);

export const accounts = pgTable(
  'accounts',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id'),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP`)
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
    id: text('id').primaryKey().notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull(),
    userId: text('user_id'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP`)
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
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex('verifications_identifier_value_key').on(table.identifier, table.value)]
);

// === APP SCHEMA ===

export const newsletters = pgTable(
  'newsletters',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    address: text('address').notNull().unique(),
    faviconUrl: text('favicon_url'),
    unsubscribeUrl: text('unsubscribe_url'),
    rssUrl: text('rss_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('newsletters_address_idx').on(table.address), // Index still useful even with unique constraint for some query plans
  ]
);

export const scanJobs = pgTable(
  'scan_jobs',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id'),
    status: varchar('status', { length: 50 }).notNull().default('PENDING'),
    emailsProcessedCount: integer('emails_processed_count').notNull().default(0),
    totalEmailsToScan: integer('total_emails_to_scan').notNull().default(0),
    inboxTotalEmails: integer('inbox_total_emails').notNull().default(0),
    newslettersFoundCount: integer('newsletters_found_count').notNull().default(0),
    currentPageToken: text('current_page_token'),
    discoveredNewsletters: jsonb('discovered_newsletters')
      .$type<Newsletter[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    result: jsonb('result').$type<Newsletter[]>(),
    error: text('error'),
    startedAt: timestamp('started_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (table) => [
    index('scan_jobs_user_id_idx').on(table.userId),
    index('scan_jobs_status_idx').on(table.status),
    uniqueIndex('scan_jobs_active_user_constraint')
      .on(table.userId)
      .where(sql`status NOT IN ('COMPLETED', 'FAILED')`),
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
