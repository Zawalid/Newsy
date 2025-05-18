import { NextRequest, NextResponse } from 'next/server';
import { fetchEmails } from '@/lib/gmail/operations';
import { DEFAULT_EMAILS_DISPLAYED } from '@/utils/constants';
import { getUserIdFromSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ success: false, error: { message: 'Unauthorized', code: 401 } }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('q') || '';
  const pageToken = searchParams.get('pageToken') || undefined;

  const result = await fetchEmails(searchQuery, DEFAULT_EMAILS_DISPLAYED, pageToken);

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: result.error.code || 500 });
  }

  return NextResponse.json({ success: true, data: result.data }, { status: 200 });
}
