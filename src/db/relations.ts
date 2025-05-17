import { relations } from 'drizzle-orm';
import { users, accounts, sessions, userSubscriptions, scanJobs, newslettersCatalog } from './schema';

// === AUTH RELATIONS ===

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts, { relationName: 'userAccounts' }),
  sessions: many(sessions, { relationName: 'userSessions' }),
  scanJobs: many(scanJobs, { relationName: 'userScanJobs' }),
  subscriptions: many(userSubscriptions, { relationName: 'userSubscriptions' }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
    relationName: 'userAccounts',
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
    relationName: 'userSessions',
  }),
}));

// === APP RELATIONS ===

export const scanJobsRelations = relations(scanJobs, ({ one }) => ({
  user: one(users, {
    fields: [scanJobs.userId],
    references: [users.id],
    relationName: 'userScanJobs',
  }),
}));

export const userSubscriptionsRelations = relations(userSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [userSubscriptions.userId],
    references: [users.id],
    relationName: 'userSubscriptionOwner',
  }),
  newsletter: one(newslettersCatalog, {
    fields: [userSubscriptions.newsletterId],
    references: [newslettersCatalog.id],
    relationName: 'userSubscriptionNewsletter',
  }),
}));

export const newslettersCatalogRelations = relations(newslettersCatalog, ({ many }) => ({
  userSubscriptions: many(userSubscriptions, { relationName: 'userSubscriptionsNewsletters' }),
}));
