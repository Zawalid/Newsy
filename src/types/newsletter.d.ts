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
    result?: Newsletter[];
    discoveredNewsletters: Newsletter[];
    startedAt: string;
    updatedAt: string;
    completedAt?: string;
  };

  interface ScanSettings {
    scanDepth: 'quick' | 'standard' | 'deep';
    smartFiltering: boolean;
    categories: {
      primary: boolean;
      promotions: boolean;
      social: boolean;
      updates: boolean;
      forums: boolean;
    };
  }
}
