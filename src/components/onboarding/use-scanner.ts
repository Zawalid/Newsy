import { DEFAULT_DEPTH_SIZES } from '@/utils/constants';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

const startScanAPI = async (settings: ScanSettings): Promise<{ message: string; jobId: number }> => {
  const res = await fetch('/api/scan/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ settings }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Unable to start your inbox scan. Please try again.');
  }
  return res.json();
};

const cancelScanAPI = async (jobId: number): Promise<{ message: string; jobId: number }> => {
  const res = await fetch('/api/scan/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Unable to cancel your scan. Please refresh the page and try again.');
  }
  return res.json();
};

const getInitialStatusForScan = (status: ScanStatus, settings?: Partial<ScanSettings>): ScanResponse => ({
  id: 0,
  status,
  emailsProcessedCount: 0,
  newslettersFoundCount: 0,
  startedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  totalEmailsToScan: DEFAULT_DEPTH_SIZES[settings?.scanDepth || 'standard'],
  discoveredNewsletters : []
});

export const useScanner = () => {
  const [jobId, setJobId] = useState<number | null>(null);
  const [scanResponse, setScanJobResponse] = useState<ScanResponse | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const handleError = useCallback((errorMessage: string, errorStatus: ScanStatus = 'FAILED') => {
    setScanJobResponse((prev) => ({
      ...(prev || getInitialStatusForScan(errorStatus)),
      status: errorStatus,
      error: errorMessage,
      completedAt: new Date().toISOString(),
    }));
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const resetScan = useCallback(() => {
    setScanJobResponse(null);
    setJobId(null);
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const startScanMutation = useMutation({
    mutationFn: (settings: ScanSettings) => startScanAPI(settings),
    onSuccess: (data, variables) => {
      resetScan();
      setJobId(data.jobId);
      setScanJobResponse({ ...getInitialStatusForScan('PENDING', variables), id: data.jobId });
      setIsScanning(true);
    },
    onError: (error: Error) => {
      handleError(
        error.message || "We couldn't start your scan. Please try again or contact support if the issue persists."
      );
    },
  });

  const cancelScanMutation = useMutation({
    mutationFn: (currentJobId: number) => cancelScanAPI(currentJobId),
    onSuccess: () => handleError('Scan cancelled by user.', 'CANCELLED'),
    onError: (error: Error) =>
      handleError(error.message || "We couldn't cancel your scan. Please refresh the page and try again."),
  });

  useEffect(() => {
    if (!jobId) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsScanning(false);
      return;
    }

    if (eventSourceRef.current) eventSourceRef.current.close();

    const source = new EventSource(`/api/scan/status?jobId=${jobId}`);
    eventSourceRef.current = source;
    setIsScanning(true);

    const onDataReceived = (data: ScanResponse) => {
      setScanJobResponse(data);
      if (['COMPLETED', 'FAILED', 'CANCELLED'].includes(data.status!)) {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
        setIsScanning(false);
      }
    };

    const setupEventListener = (eventType: string) => {
      source.addEventListener(eventType, (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          onDataReceived(data);
        } catch (e) {
          console.log(e);
          handleError('We had trouble processing the scan results. Please refresh the page and try again.');
        }
      });
    };

    ['job-status', 'job-completed', 'job-failed', 'job-cancelled'].forEach(setupEventListener);

    source.addEventListener('job-error', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        handleError(data.message || 'There was an issue with your scan. Please try again later.');
      } catch (e) {
        console.log(e);
        handleError('We encountered an unexpected error. Please refresh the page and try again.');
      }
    });

    source.onerror = () => {
      if (eventSourceRef.current && isScanning)
        handleError('We lost connection to the scan server. Please check your internet connection and try again.');
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  return {
    startScan: (settings: ScanSettings) => {
      setScanJobResponse(getInitialStatusForScan('PREPARING', settings));
      startScanMutation.mutate(settings);
    },
    cancelScan: () => {
      if (jobId) cancelScanMutation.mutate(jobId);
      else setIsScanning(false);
    },
    resetScan,
    scanResponse,
    isScanning,
    jobId,
  };
};
