import type {
  User as UserType,
  NewUser as NewUserType,
  Account as AccountType,
  NewAccount as NewAccountType,
  Session as SessionType,
  NewSession as NewSessionType,
  ScanJob as ScanJobType,
  NewScanJob as NewScanJobType,
  Newsletter as NewsletterType,
  NewNewsletter as NewNewsletterType,
  UserSubscription as UserSubscriptionType,
  NewUserSubscription as NewUserSubscriptionType,
} from '@/db/schema';

declare global {
  // User type
  type User = UserType;
  type NewUser = NewUserType;

  // Account type
  type Account = AccountType;
  type NewAccount = NewAccountType;

  // Session type
  type Session = SessionType;
  type NewSession = NewSessionType;

  // ScanJob type
  type ScanJob = ScanJobType;
  type NewScanJob = NewScanJobType;

  // Newsletter type
  type Newsletter = NewsletterType & { category?: string };
  type NewNewsletter = NewNewsletterType;

  // User Subscription type
  type UserSubscription = UserSubscriptionType;
  type NewUserSubscription = NewUserSubscriptionType;
}

export {};
