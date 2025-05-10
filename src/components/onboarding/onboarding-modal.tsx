'use client';

import { useState, useEffect } from 'react';
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
  ScanningStep,
  CompletionStep,
} from './steps';
import ScanSettings from './scan-settings';
import { useScanner } from './use-scanner';

const totalSteps = 5;

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(5);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  const [showScanSettings, setShowScanSettings] = useState(false);
  const [scanSettings, setScanSettings] = useState<ScanSettings>({
    scanDepth: 'standard',
    smartFiltering: true,
    categories: {
      primary: true,
      promotions: true,
      social: false,
      updates: false,
      forums: false,
    },
  });
  const router = useRouter();

  const { startScan, scanStatus, isScanning } = useScanner(scanSettings);

  const scanCompleted = scanStatus?.status === 'COMPLETED';

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowRight' && !isScanning && !scanCompleted) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && !isScanning && !scanCompleted) {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentStep, isScanning, scanCompleted]);

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <Dialog open={isOpen}>
      <DialogTitle className='hidden'>Welcome To Newsy</DialogTitle>
      <DialogContent className='h-[80vh] max-h-[800px] w-[80vw] max-w-[1200px] overflow-hidden rounded-2xl border border-slate-200 p-0 shadow-xl dark:border-slate-800 [&>button]:hidden'>
        <div className='flex h-full flex-col'>
          <div className='relative flex-1'>
            {scanCompleted && (
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
              {!isScanning && !scanCompleted && (
                <motion.div
                  key={`step-${currentStep}`}
                  initial='hidden'
                  animate='visible'
                  exit='exit'
                  variants={contentVariants}
                  className='absolute inset-0 flex items-center justify-center p-8'
                >
                  {currentStep === 1 && <WelcomeStep onNext={handleNext} />}

                  {currentStep === 2 && <DiscoveryStep onNext={handleNext} onBack={handleBack} />}

                  {currentStep === 3 && <ReadingStep onNext={handleNext} onBack={handleBack} />}

                  {currentStep === 4 && <UnsubscribeStep onNext={handleNext} onBack={handleBack} />}

                  {currentStep === 5 && (
                    <ScanInitiationStep
                      onStartScan={startScan}
                      onBack={handleBack}
                      onShowScanSettings={() => setShowScanSettings(true)}
                    />
                  )}
                </motion.div>
              )}

              {isScanning && !scanCompleted && (
                <motion.div
                  key='scanning'
                  initial='hidden'
                  animate='visible'
                  exit='exit'
                  variants={contentVariants}
                  className='absolute inset-0 flex items-center justify-center p-8'
                >
                  <ScanningStep scanStatus={scanStatus!} onCancel={handleBack} />
                </motion.div>
              )}

              {scanCompleted && (
                <motion.div
                  key='complete'
                  initial='hidden'
                  animate='visible'
                  exit='exit'
                  variants={contentVariants}
                  className='absolute inset-0 flex items-center justify-center p-8'
                >
                  <CompletionStep
                    scanStatus={scanStatus}
                    onViewNewsletters={() => {
                      router.replace('/app/newsletters');
                      setIsOpen(false);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!isScanning && !scanCompleted && (
            <div className='py-6'>
              <div className='flex justify-center gap-0.5'>
                {Array.from({ length: totalSteps }).map((_, index) => (
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
          onSaveSettings={(settings: ScanSettings) => setScanSettings(settings)}
        />
      </DialogContent>
    </Dialog>
  );
}
