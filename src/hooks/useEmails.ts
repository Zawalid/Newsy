import { getEmail, getEmails } from "@/queries/emailsQueries";
import { useQuery } from "@tanstack/react-query";

const isAPIError = (data: any): data is APIError => data && "code" in data;

export const useEmails = (searchQuery: string, pageToken: string | undefined) => {
  const { data, isPending } = useQuery<{ emails: Email[]; nextPageToken: string } | APIError>({
    queryKey: ["emails", searchQuery, pageToken],
    queryFn: () => getEmails(searchQuery, pageToken || ""),
    // TODO : Uncomment the following lines to enable background refetching
    // refetchInterval: 1000 * 60,
    // refetchIntervalInBackground: true,
  });

  if (isAPIError(data)) {
    return { emails: null, nextPageToken: undefined, isLoading: isPending, error: data };
  }

  return {
    emails: data?.emails ?? [],
    nextPageToken: data?.nextPageToken,
    isLoading: isPending,
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
