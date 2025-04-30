interface Newsletter {
  id: string;
  name: string;
  address: string;
  unsubscribeUrl?: string;
  faviconUrl?: string;
}

interface ScanProgress {
  scannedCount: number;
  totalToScan: number;
  newslettersFound: number;
  percentComplete: number;
  elapsedTime: number; // in seconds
  estimatedTimeRemaining?: number; // in seconds
  processingSpeed?: number; // emails per second
  status: 'initializing' | 'scanning' | 'processing' | 'completed' | 'error';
}
