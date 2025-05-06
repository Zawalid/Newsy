import { relations } from 'drizzle-orm';
import { users, accounts, sessions, newsletters, scanJobs } from './schema';

// === AUTH RELATIONS ===

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts, { relationName: 'userAccounts' }),
  sessions: many(sessions, { relationName: 'userSessions' }),
  scanJobs: many(scanJobs, { relationName: 'userScanJobs' }),
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

export const newslettersRelations = relations(newsletters, () => ({}));
