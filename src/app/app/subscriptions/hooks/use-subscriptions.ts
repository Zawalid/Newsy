import { useQuery } from '@tanstack/react-query';

export const useSubscriptions = () => {
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const response = await fetch('/api/subscriptions');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  return { subscriptions, isLoading };
};
