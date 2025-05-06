interface Credentials {
  refresh_token?: string | null;
  expiry_date?: number | null;
  access_token?: string | null;
  token_type?: string | null;
  id_token?: string | null;
  scope?: string;
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
