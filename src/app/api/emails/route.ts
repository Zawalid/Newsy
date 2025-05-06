import { NextRequest, NextResponse } from 'next/server';
import { fetchEmails } from '@/lib/gmail/operations';
import { DEFAULT_EMAILS_DISPLAYED } from '@/utils/constants';
// import { getUserIdFromSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  // TODO : Uncomment this when testing is done
  // const userId = await getUserIdFromSession();
  // if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('q') || '';
  const pageToken = searchParams.get('pageToken') || undefined;

  const { data, error } = await fetchEmails(searchQuery, DEFAULT_EMAILS_DISPLAYED, pageToken);

  if (error) return NextResponse.json({ message: error.message, code: error.code }, { status: 500 });

  return NextResponse.json(data);
}
