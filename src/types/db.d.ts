import type {
  User as UserType,
  NewUser as NewUserType,
  Account as AccountType,
  NewAccount as NewAccountType,
  Session as SessionType,
  NewSession as NewSessionType,
  Newsletter as NewsletterType,
  NewNewsletter as NewNewsletterType,
  ScanJob as ScanJobType,
  NewScanJob as NewScanJobType,
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

  // Newsletter type
  type Newsletter = NewsletterType & { category?: string };
  type NewNewsletter = NewNewsletterType;

  // ScanJob type
  type ScanJob = ScanJobType;
  type NewScanJob = NewScanJobType;
}

export {};
