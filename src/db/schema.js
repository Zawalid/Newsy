"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.articles = exports.newsletters = exports.sessions = exports.accounts = exports.users = exports.verificationTokens = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_orm_1 = require("drizzle-orm");
exports.verificationTokens = (0, pg_core_1.pgTable)("verification_tokens", {
    identifier: (0, pg_core_1.text)().notNull(),
    token: (0, pg_core_1.text)().notNull(),
    expires: (0, pg_core_1.timestamp)({ precision: 3, mode: "string" }).notNull(),
}, function (table) { return [
    (0, pg_core_1.uniqueIndex)("verification_tokens_identifier_token_key").using("btree", table.identifier.asc().nullsLast().op("text_ops"), table.token.asc().nullsLast().op("text_ops")),
]; });
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.text)().primaryKey().notNull(),
    name: (0, pg_core_1.text)(),
    email: (0, pg_core_1.text)(),
    emailVerified: (0, pg_core_1.timestamp)("email_verified", { precision: 3, mode: "string" }),
    image: (0, pg_core_1.text)(),
}, function (table) { return [
    (0, pg_core_1.uniqueIndex)("users_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
]; });
exports.accounts = (0, pg_core_1.pgTable)("accounts", {
    id: (0, pg_core_1.text)().primaryKey().notNull(),
    userId: (0, pg_core_1.text)("user_id").notNull(),
    type: (0, pg_core_1.text)().notNull(),
    provider: (0, pg_core_1.text)().notNull(),
    providerAccountId: (0, pg_core_1.text)("provider_account_id").notNull(),
    refreshToken: (0, pg_core_1.text)("refresh_token"),
    accessToken: (0, pg_core_1.text)("access_token"),
    expiresAt: (0, pg_core_1.integer)("expires_at"),
    tokenType: (0, pg_core_1.text)("token_type"),
    scope: (0, pg_core_1.text)(),
    idToken: (0, pg_core_1.text)("id_token"),
    sessionState: (0, pg_core_1.text)("session_state"),
}, function (table) { return [
    (0, pg_core_1.uniqueIndex)("accounts_provider_provider_account_id_key").using("btree", table.provider.asc().nullsLast().op("text_ops"), table.providerAccountId.asc().nullsLast().op("text_ops")),
    (0, pg_core_1.foreignKey)({
        columns: [table.userId],
        foreignColumns: [exports.users.id],
        name: "accounts_user_id_fkey",
    })
        .onUpdate("cascade")
        .onDelete("cascade"),
]; });
exports.sessions = (0, pg_core_1.pgTable)("sessions", {
    id: (0, pg_core_1.text)().primaryKey().notNull(),
    sessionToken: (0, pg_core_1.text)("session_token").notNull(),
    userId: (0, pg_core_1.text)("user_id").notNull(),
    expires: (0, pg_core_1.timestamp)({ precision: 3, mode: "string" }).notNull(),
}, function (table) { return [
    (0, pg_core_1.uniqueIndex)("sessions_session_token_key").using("btree", table.sessionToken.asc().nullsLast().op("text_ops")),
    (0, pg_core_1.foreignKey)({
        columns: [table.userId],
        foreignColumns: [exports.users.id],
        name: "sessions_user_id_fkey",
    })
        .onUpdate("cascade")
        .onDelete("cascade"),
]; });
exports.newsletters = (0, pg_core_1.pgTable)("newsletters", {
    id: (0, pg_core_1.text)().primaryKey().notNull(),
    email: (0, pg_core_1.text)().notNull(),
    rssUrl: (0, pg_core_1.text)(),
    isActive: (0, pg_core_1.boolean)().default(true).notNull(),
    userId: (0, pg_core_1.text)().notNull(),
    createdAt: (0, pg_core_1.timestamp)({ precision: 3, mode: "string" })
        .default((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"]))))
        .notNull(),
}, function (table) { return [
    (0, pg_core_1.foreignKey)({
        columns: [table.userId],
        foreignColumns: [exports.users.id],
        name: "newsletters_userId_fkey",
    })
        .onUpdate("cascade")
        .onDelete("restrict"),
]; });
exports.articles = (0, pg_core_1.pgTable)("articles", {
    id: (0, pg_core_1.text)().primaryKey().notNull(),
    title: (0, pg_core_1.text)().notNull(),
    content: (0, pg_core_1.text)().notNull(),
    newsletterId: (0, pg_core_1.text)().notNull(),
    savedAt: (0, pg_core_1.timestamp)({ precision: 3, mode: "string" })
        .default((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"]))))
        .notNull(),
}, function (table) { return [
    (0, pg_core_1.foreignKey)({
        columns: [table.newsletterId],
        foreignColumns: [exports.newsletters.id],
        name: "articles_newsletterId_fkey",
    })
        .onUpdate("cascade")
        .onDelete("restrict"),
]; });
var templateObject_1, templateObject_2;
