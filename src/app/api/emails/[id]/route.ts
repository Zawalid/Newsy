import { fetchEmail } from '@/lib/gmail/operations';
import { NextRequest, NextResponse } from 'next/server';
// import { getUserIdFromSession } from '@/lib/auth';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // TODO : Uncomment this when testing is done
  // const userId = await getUserIdFromSession();
  // if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const emailId = (await params).id;

  if (!emailId) return NextResponse.json({ error: 'Email ID is required.' }, { status: 400 });

  const { data, error } = await fetchEmail(emailId);

  if (error) return NextResponse.json({ message: error.message, code: error.code }, { status: error.code });

  return NextResponse.json(data);
}
