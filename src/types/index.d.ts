type ScanStatus = {
  id: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  emailsProcessedCount: number;
  totalEmailsToScan: number;
  newslettersFoundCount: number;
  error?: string;
  result?: Newsletter[];
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
};

interface ScanSettings {
  scanDepth: "quick" | "standard" | "deep"
  smartFiltering: boolean
  categories: {
    primary: boolean
    promotions: boolean
    social: boolean
    updates: boolean
    forums: boolean
  }
}
