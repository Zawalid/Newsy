import { useSession } from '@/lib/auth/client';
import OnboardingModal from './onboarding-modal';

export function OnboardingController() {
  const session = useSession();

  const hasOnboarded = session.data?.user.hasOnboarded ?? false;
  const hasSkippedOnboardingScan = session.data?.user.hasSkippedOnboardingScan ?? false;

  const shouldShowModal = !!session.data && !hasOnboarded && !hasSkippedOnboardingScan;

  console.log(shouldShowModal)

  return shouldShowModal ? <OnboardingModal /> : null;
}
