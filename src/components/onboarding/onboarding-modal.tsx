'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactConfetti from 'react-confetti';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  WelcomeStep,
  DiscoveryStep,
  ReadingStep,
  UnsubscribeStep,
  ScanInitiationStep,
  Scanning,
  ScanCompleted,
  ScanSettings,
  useScanner,
  ScanError,
  ScanCancelled,
} from '.';
import { DEFAULT_SCAN_SETTINGS } from '@/utils/constants';
import { markOnboardingFlowCompleted, markScanAsSkippedDuringOnboarding } from '@/lib/action/onboarding';

const TOTAL_FEATURE_STEPS = 4;
const SCAN_INITIATION_STEP_NUMBER = TOTAL_FEATURE_STEPS + 1;

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  const [showScanSettings, setShowScanSettings] = useState(false);
  const [scanSettings, setScanSettings] = useState<ScanSettings>(DEFAULT_SCAN_SETTINGS);
  const router = useRouter();

  const { startScan, cancelScan, scanResponse, isScanning, resetScan } = useScanner();

  const isScanTerminal =
    scanResponse?.status === 'COMPLETED' || scanResponse?.status === 'FAILED' || scanResponse?.status === 'CANCELLED';
  const scanHasProblem = scanResponse?.status === 'FAILED' || scanResponse?.status === 'CANCELLED';
  const scanCompletedSuccessfully = scanResponse?.status === 'COMPLETED';

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < SCAN_INITIATION_STEP_NUMBER && !isScanning && !isScanTerminal) {
      setCurrentStep((cs) => cs + 1);
    }
  }, [currentStep, isScanning, isScanTerminal]);

  const handleBack = useCallback(() => {
    if (isScanning && !isScanTerminal) {
      cancelScan();
      return;
    }
    if (currentStep > 1 && !isScanning && !isScanTerminal) {
      setCurrentStep((cs) => cs - 1);
    }
  }, [currentStep, isScanning, isScanTerminal, cancelScan]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || showScanSettings || isScanning || isScanTerminal) return;
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handleBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showScanSettings, isScanning, isScanTerminal, handleNext, handleBack]);

  const handleSkipScanAndGoToApp = useCallback(async () => {
    if (isScanning) cancelScan();
    resetScan();
    setIsOpen(false);
    try {
      await markScanAsSkippedDuringOnboarding();
    } catch (error) {
      console.error('Failed to mark scan as skipped:', error);
    }

    router.replace('/app/newsletters');
  }, [isScanning, cancelScan, resetScan, router]);

  const handleRestartScan = useCallback(() => {
    resetScan();
    startScan(scanSettings);
  }, [resetScan, startScan, scanSettings]);

  const renderStepContent = () => {
    if ((isScanning || scanResponse?.status === 'PREPARING') && !isScanTerminal)
      return <Scanning scanResponse={scanResponse!} onCancel={handleBack} />;

    if (scanResponse?.status === 'CANCELLED')
      return <ScanCancelled onRestartScan={handleRestartScan} onSkip={handleSkipScanAndGoToApp} />;

    if (scanCompletedSuccessfully) {
      return (
        <ScanCompleted
          scanResponse={scanResponse!}
          onViewNewsletters={async () => {
            resetScan();
            setIsOpen(false);
            try {
              await markOnboardingFlowCompleted();
            } catch (error) {
              console.error('Failed to mark onboarding as completed:', error);
            }
            router.replace('/app/newsletters');
          }}
        />
      );
    }
    if (scanHasProblem) {
      return (
        <ScanError
          error={scanResponse?.error || 'An unexpected issue occurred.'}
          onRetry={handleRestartScan}
          onSkip={handleSkipScanAndGoToApp}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={handleNext} />;
      case 2:
        return <DiscoveryStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <ReadingStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <UnsubscribeStep onNext={handleNext} onBack={handleBack} />;
      case SCAN_INITIATION_STEP_NUMBER:
        return (
          <ScanInitiationStep
            onStartScan={() => startScan(scanSettings)}
            onBack={handleBack}
            onShowScanSettings={() => setShowScanSettings(true)}
            onSkip={handleSkipScanAndGoToApp}
          />
        );
      default:
        setCurrentStep(1);
        return <WelcomeStep onNext={handleNext} />;
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogTitle className='sr-only'>Newsy Onboarding</DialogTitle>
      <DialogContent className='h-[80vh] max-h-[800px] w-[80vw] max-w-[1200px] overflow-hidden rounded-2xl border border-slate-200 p-0 shadow-xl dark:border-slate-800 [&>button]:hidden'>
        <div className='flex h-full flex-col'>
          <div className='relative flex-1'>
            {scanCompletedSuccessfully && (
              <ReactConfetti
                width={windowDimensions.width * 0.8}
                height={windowDimensions.height * 0.8}
                recycle={false}
                numberOfPieces={200}
                gravity={0.15}
                colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
              />
            )}
            <AnimatePresence mode='wait'>
              <motion.div
                key={
                  isScanning
                    ? 'scanning'
                    : scanCompletedSuccessfully
                      ? 'complete'
                      : scanHasProblem
                        ? 'problem'
                        : `step-${currentStep}`
                }
                initial='hidden'
                animate='visible'
                exit='exit'
                variants={contentVariants}
                className='absolute inset-0 flex items-center justify-center p-6 sm:p-8 md:p-12'
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {!isScanning && !isScanTerminal && currentStep <= SCAN_INITIATION_STEP_NUMBER && (
            <div className='py-4 sm:py-6'>
              <div className='flex justify-center gap-1 sm:gap-1.5'>
                {Array.from({ length: SCAN_INITIATION_STEP_NUMBER }).map((_, index) => (
                  // TODO : Remove the onclick
                  <div key={index} className='group relative p-1' onClick={() => setCurrentStep(index + 1)}>
                    <div
                      className={`h-3 w-3 rounded-full transition-all duration-300 ${
                        currentStep === index + 1 ? 'w-8 bg-blue-600' : 'bg-slate-300 dark:bg-slate-500'
                      }`}
                    />
                    {currentStep === index + 1 && (
                      <motion.div
                        layoutId='activeIndicator'
                        className='absolute inset-0 rounded-full border-2 border-blue-600'
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <ScanSettings
          open={showScanSettings}
          onOpenChange={setShowScanSettings}
          currentSettings={scanSettings}
          onSaveSettings={(newSettings: ScanSettings) => setScanSettings(newSettings)}
        />
      </DialogContent>
    </Dialog>
  );
}
