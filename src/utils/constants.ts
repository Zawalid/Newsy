export const DEFAULT_EMAILS_DISPLAYED = 50;
export const DEFAULT_GMAIL_LIST_PAGE_SIZE = 25;
export const DEFAULT_CHUNK_SIZE = 25;

// TODO : CHANGE 100 and 'quick'
export const DEFAULT_DEPTH_SIZES = { quick: 200, standard: 3000, deep: 5000 };
export const DEFAULT_SCAN_SETTINGS: ScanSettings = {
  scanDepth: 'quick',
  smartFiltering: true,
  categories: {
    primary: true,
    promotions: true,
    social: false,
    updates: false,
    forums: false,
  },
};

export const SCAN_JOB_STATUS = ['PREPARING', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'] as const;
export const USER_SUBSCRIPTION_STATUS = ['ACTIVE', 'UNSUBSCRIBED_BY_USER', 'IGNORED_BY_USER'] as const;
