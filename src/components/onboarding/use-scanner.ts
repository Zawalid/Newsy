import { DEFAULT_DEPTH_SIZES } from '@/utils/constants';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const startScan = async (settings: ScanSettings): Promise<{ message: string; jobId: number }> => {
  const res = await fetch('/api/scan/start', { method: 'POST', body: JSON.stringify({ settings }) });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to start scan');
  }
  return res.json();
};

export const useScanner = (settings: ScanSettings) => {
  const [activeJobId, setActiveJobId] = useState<number | null>(null);
  const [scanStatus, setScanStatus] = useState<ScanStatus | null>();
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScanMutation = useMutation({
    mutationFn: () => startScan(settings),
    onSuccess: (data) => {
      console.log('Scan started, Job ID:', data.jobId);
      setActiveJobId(data.jobId);
      setError(null);
      //   toast.success('Scan started', { description: "We're now scanning your inbox for newsletters." });
    },
    onError: (error: Error) => {
      console.error('Error starting scan:', error);
      setError(error.message);
      setIsScanning(false);
      //   toast.error('Error starting scan', { description: error.message });
    },
  });

  useEffect(() => {
    if (!activeJobId) return;

    const eventSource = new EventSource(`/api/scan/status?jobId=${activeJobId}`);

    eventSource.addEventListener('job-status', (event) => {
      try {
        const data = JSON.parse(event.data);
        setScanStatus(data);
        setError(null);
      } catch (e) {
        console.error('Error parsing SSE status data:', e);
        setError('Error parsing SSE status data');
        eventSource.close();
      }
    });

    eventSource.addEventListener('job-completed', (event) => {
      try {
        const data = JSON.parse(event.data);
        setScanStatus(data);
        setError(null);
        setIsScanning(false);
        eventSource.close();
      } catch (e) {
        console.error('Error parsing SSE completed data:', e);
        setError('Error parsing SSE status data');
        eventSource.close();
      }
    });

    eventSource.addEventListener('job-error', (event) => {
      try {
        const data = JSON.parse(event.data);
        setError(data.message || 'An error occurred during scanning');
        setScanStatus((prev) => (prev ? { ...prev, status: 'FAILED', error: data.message } : null));
        eventSource.close();
      } catch (e) {
        console.error('Error parsing SSE error data:', e);
        setError('Error parsing SSE status data');
        eventSource.close();
      }
    });

    // Generic error handler
    eventSource.onerror = (err) => {
      console.error('EventSource error:', err);
      setError('An error occurred during scanning. Please try again.');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [activeJobId]);

  return {
    startScan: () => {
      setScanStatus({
        id: 0,
        status: 'PENDING',
        emailsProcessedCount: 0,
        newslettersFoundCount: 0,
        totalEmailsToScan: DEFAULT_DEPTH_SIZES[settings.scanDepth || 'standard'],
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      startScanMutation.mutate();
      setIsScanning(true);
    },
    scanStatus,
    error,
    isScanning,
  };
};
