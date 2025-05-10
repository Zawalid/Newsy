'use client';

import OnboardingModal from '@/components/onboarding/onboarding-modal';
import { NewsletterScanner } from './scanner';

export default function Page() {
  return (
    <div className='container mx-auto space-y-6 py-6'>
      {/* <NewsletterScanner /> */}
      <OnboardingModal />
    </div>
  );
}
