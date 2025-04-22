import { pgTable, uniqueIndex, text, timestamp, foreignKey, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// =========== AUTH

export const users = pgTable(
  "users",
  {
    id: text()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    name: text().notNull(),
    email: text().notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
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
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    uniqueIndex("accounts_provider_account_id_key").using(
      "btree",
      table.providerId.asc().nullsLast().op("text_ops"),
      table.accountId.asc().nullsLast().op("text_ops")
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
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull(),
    userId: text("user_id").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    uniqueIndex("sessions_token_key").using("btree", table.token.asc().nullsLast().op("text_ops")),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "sessions_user_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const verifications = pgTable(
  "verifications",
  {
    id: text()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    uniqueIndex("verifications_identifier_value_key").using(
      "btree",
      table.identifier.asc().nullsLast().op("text_ops"),
      table.value.asc().nullsLast().op("text_ops")
    ),
  ]
);

// ============ APP

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
