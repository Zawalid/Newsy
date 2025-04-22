import { relations } from "drizzle-orm/relations";
import { users, accounts, sessions, newsletters, articles } from "./schema";

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  newsletters: many(newsletters),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const newslettersRelations = relations(newsletters, ({ one, many }) => ({
  user: one(users, {
    fields: [newsletters.userId],
    references: [users.id],
  }),
  articles: many(articles),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  newsletter: one(newsletters, {
    fields: [articles.newsletterId],
    references: [newsletters.id],
  }),
}));
