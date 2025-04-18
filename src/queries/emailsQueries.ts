export const getEmails = async (
  searchQuery: string,
  pageToken: string
): Promise<{ emails: Email[]; nextPageToken: string } | APIError> => {
  const res = await fetch(`/api/emails?q=${searchQuery}&pageToken=${pageToken}`);
  return res.json();
};

export const getEmail = async (emailId: string): Promise<Email | APIError> => {
  const res = await fetch(`/api/emails/${emailId}`);
  return res.json();
};

export const performEmailAction = async (
  action: "markAsRead" | "markAsUnread" | "delete" | "untrash",
  emailId: string,
  value?: boolean
): Promise<{ success: boolean } | APIError> => {
  const res = await fetch("/api/emails/actions", {
    method: "POST",
    body: JSON.stringify({ action, emailId, value }),
  });
  return res.json();
};
