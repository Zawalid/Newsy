// import { fetchAPI } from '@/utils/fetchAPI';
// import { useQuery } from '@tanstack/react-query';
import { SAMPLE_SUBSCRIPTIONS } from '@/data-access/sample.data';

export const useSubscriptions = () => {
  // const { data, isPending: isLoading } = useQuery({
  //   queryKey: ['subscriptions'],
  //   queryFn: () => fetchAPI<UserSubscriptionWithNewsletter[]>('/api/subscriptions'),
  // });

  // if (!data || !data.success) return { subscriptions: [], isLoading, error: data?.error ?? null };

  // return { subscriptions: data?.data ?? [], isLoading, error: null };

  return { subscriptions: SAMPLE_SUBSCRIPTIONS, isLoading: false, error: null };
};
