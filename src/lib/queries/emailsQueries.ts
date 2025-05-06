export const getEmails = async (
  searchQuery: string,
  pageToken: string
): Promise<{ emails: EmailMetadata[]; nextPageToken: string } | APIError> => {
  const res = await fetch(`/api/emails?q=${searchQuery}&pageToken=${pageToken}`);
  return res.json();
};

export const getEmail = async (emailId: string): Promise<Email | APIError> => {
  if (!emailId) return { message: 'Email ID is required', code: 400 };
  const res = await fetch(`/api/emails/${emailId}`);
  return res.json();
};

export const performEmailAction = async (
  action: EmailAction,
  emailId: string,
  value?: boolean
): Promise<{ success: boolean } | APIError> => {
  const res = await fetch('/api/emails/actions', {
    method: 'POST',
    body: JSON.stringify({ action, emailId, value }),
  });
  return res.json();
};
