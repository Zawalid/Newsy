import {
  pgTable,
  uniqueIndex,
  text,
  timestamp,
  foreignKey,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text().notNull(),
    token: text().notNull(),
    expires: timestamp({ precision: 3, mode: "date" }).notNull(),
  },
  (table) => [
    uniqueIndex("verification_tokens_identifier_token_key").using(
      "btree",
      table.identifier.asc().nullsLast().op("text_ops"),
      table.token.asc().nullsLast().op("text_ops")
    ),
  ]
);

export const users = pgTable(
  "users",
  {
    id: text()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    name: text(),
    email: text(),
    emailVerified: timestamp("email_verified", { precision: 3, mode: "date" }),
    image: text(),
  },
  (table) => [
    uniqueIndex("users_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
  ]
);

export const accounts = pgTable(
  "accounts",
  {
    id: text()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    userId: text("user_id").notNull(),
    type: text().notNull(),
    provider: text().notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text(),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => [
    uniqueIndex("accounts_provider_provider_account_id_key").using(
      "btree",
      table.provider.asc().nullsLast().op("text_ops"),
      table.providerAccountId.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "accounts_user_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const sessions = pgTable(
  "sessions",
  {
    id: text()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    sessionToken: text("session_token").notNull(),
    userId: text("user_id").notNull(),
    expires: timestamp({ precision: 3, mode: "date" }).notNull(),
  },
  (table) => [
    uniqueIndex("sessions_session_token_key").using(
      "btree",
      table.sessionToken.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "sessions_user_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const newsletters = pgTable(
  "newsletters",
  {
    id: text()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    email: text().notNull(),
    rssUrl: text(),
    isActive: boolean().default(true).notNull(),
    userId: text().notNull(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "newsletters_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
  ]
);

export const articles = pgTable(
  "articles",
  {
    id: text()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    title: text().notNull(),
    content: text().notNull(),
    newsletterId: text().notNull(),
    savedAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.newsletterId],
      foreignColumns: [newsletters.id],
      name: "articles_newsletterId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
  ]
);
