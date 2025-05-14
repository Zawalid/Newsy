import { google } from 'googleapis';
import { getSession } from '@/lib/auth';
import { getAccountByUserId } from '@/data-access/users';
import { env } from '@/env';

// TODO : REMOVE THIS !!!! AFTER YOU FINISH THE TESTS
export const getGmailClient = async (userId?: string | null) => {
  const session = await getSession();

  const id = userId ? userId : session ? session.user.id : null;

  if (!id) throw new Error('Not authenticated');

  const account = await getAccountByUserId(id);

  if (!account) throw new Error('Google account not found');

  const oauth2Client = new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);

  oauth2Client.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
};
