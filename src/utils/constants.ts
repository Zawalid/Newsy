export const DEFAULT_EMAILS_DISPLAYED = 50;
export const DEFAULT_GMAIL_LIST_PAGE_SIZE = 30; // 100
export const DEFAULT_CHUNK_SIZE = 25;
export const DEFAULT_DEPTH_SIZES = { quick: 1000, standard: 3000, deep: 5000 };

export const DEFAULT_SCAN_SETTINGS: ScanSettings = {
  scanDepth: 'standard',
  smartFiltering: true,
  categories: {
    primary: true,
    promotions: true,
    social: false,
    updates: false,
    forums: false,
  },
};
