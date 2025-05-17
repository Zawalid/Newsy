import { SCAN_JOB_STATUS } from '@/utils/constants';

declare global {
  type ScanStatus = (typeof SCAN_JOB_STATUS)[number];

  type ScanResponse = {
    id: number;
    status: ScanStatus;
    emailsProcessedCount: number;
    totalEmailsToScan: number;
    newslettersFoundCount: number;
    error?: string;
    discoveredNewsletters: DiscoveredNewsletter[];
    startedAt: string;
    updatedAt: string;
    completedAt?: string;
  };

  type ScanSettings = {
    scanDepth: 'quick' | 'standard' | 'deep';
    smartFiltering: boolean;
    categories: {
      primary: boolean;
      promotions: boolean;
      social: boolean;
      updates: boolean;
      forums: boolean;
    };
  };

  type DiscoveredNewsletter = {
    id: string;
    name: string;
    address: string;
    faviconUrl: string | null;
    unsubscribeUrl: string | null;
  };
}
