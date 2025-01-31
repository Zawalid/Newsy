import { getEmail, getEmails } from "@/queries/emailsQueries";
import { useQuery } from "@tanstack/react-query";

const isAPIError = (data: any): data is APIError => data && "code" in data;

export const useEmails = (
  searchQuery: string,
  pageToken: string | undefined,
  placeholderData?: EmailsListResponse
) => {
  const { data, isPending, isFetching } = useQuery<EmailsListResponse | APIError>({
    queryKey: ["emails", searchQuery, pageToken],
    queryFn: () => getEmails(searchQuery, pageToken || ""),
    // placeholderData : searchQuery || pageToken ?  undefined : placeholderData,
    placeholderData: (previousData) => previousData ?? placeholderData,

    // TODO : Uncomment the following lines to enable background refetching
    // refetchInterval: 1000 * 60,
    // refetchIntervalInBackground: true,
  });


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
  };
};
export const useEmail = (emailId: string) => {
  const { data, isPending } = useQuery<Email | APIError>({
    queryKey: ["email", emailId],
    queryFn: () => getEmail(emailId),
    staleTime: Infinity,
  });

  if (isAPIError(data)) return { email: null, error: data, isLoading: isPending };

  return { email: data ?? null, error: null, isLoading: isPending };
};
