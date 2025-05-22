import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAPI } from '@/utils/fetchAPI';

export const useEmails = (
  searchQuery: string,
  pageToken: string | null,
  placeholderData?: APIResult<EmailsListResponse>
) => {
  const {
    data,
    isPending: isLoading,
    isFetching,
  } = useQuery<APIResult<EmailsListResponse>>({
    queryKey: ['emails', searchQuery, pageToken],
    queryFn: () => fetchAPI<EmailsListResponse>(`/api/emails?q=${searchQuery}&pageToken=${pageToken || ''}`),
    placeholderData,
    // TODO : Uncomment the background refetching
    // refetchInterval : 1000 * 60 * 3,
    // refetchIntervalInBackground: true,
  });

  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['emails', searchQuery, pageToken] });

  if (!data || !data.success) return { emails: [], isLoading, isFetching, error: data?.error ?? null, invalidate };

  return {
    emails: data.data?.emails ?? [],
    nextPageToken: data.data?.nextPageToken ?? null,
    isLoading,
    isFetching,
    error: null,
    invalidate,
  };
};

export const useEmail = (emailId: string) => {
  const { data, isPending: isLoading } = useQuery<APIResult<Email>>({
    queryKey: ['email', emailId],
    queryFn: () => {
      if (!emailId) return Promise.resolve({ success: false, error: { message: 'Email ID is required', code: 400 } });
      return fetchAPI<Email>(`/api/emails/${emailId}`);
    },
  });

  if (!data || !data.success) return { email: null, error: data?.error ?? null, isLoading };

  return { email: data.data ?? null, error: null, isLoading };
};
