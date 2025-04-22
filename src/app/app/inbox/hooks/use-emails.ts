import { getEmail, getEmails } from "@/lib/queries/emailsQueries";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// TODO : Uncomment the background refetching

const isAPIError = (data: any): data is APIError => data && "message" in data && "code" in data;

export const useEmails = (
  searchQuery: string,
  pageToken: string | null,
  placeholderData?: EmailsListResponse
) => {
  const { data, isPending, isFetching } = useQuery<EmailsListResponse | APIError>({
    queryKey: ["emails", searchQuery, pageToken],
    queryFn: () => getEmails(searchQuery, pageToken || ""),
    placeholderData: (previousData) => previousData ?? placeholderData,

    // refetchInterval : 1000 * 60 * 3,
    // refetchIntervalInBackground: true,
  });
  const queryClient = useQueryClient();

  if (isAPIError(data)) {
    return {
      emails: null,
      nextPageToken: undefined,
      isLoading: isPending,
      isFetching,
      error: data,
    };
  }

  return {
    emails: data?.emails ?? [],
    nextPageToken: data?.nextPageToken,
    isLoading: isPending,
    isFetching,
    error: null,
    invalidate: () =>
      queryClient.invalidateQueries({ queryKey: ["emails", searchQuery, pageToken] }),
  };
};
export const useEmail = (emailId: string) => {
  const { data, isPending } = useQuery<Email | APIError>({
    queryKey: ["email", emailId],
    queryFn: () => getEmail(emailId),
    // refetchInterval: 1000 * 60 * 5,
  });

  if (isAPIError(data)) return { email: null, error: data, isLoading: isPending };

  return {
    email: data ?? null,
    error: null,
    isLoading: isPending,
  };
};
