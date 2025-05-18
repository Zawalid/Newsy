import { fetchEmail } from '@/lib/gmail/operations';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromSession } from '@/lib/auth';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ success: false, error: { message: 'Unauthorized', code: 401 } }, { status: 401 });
  }

  const emailId = (await params).id;

  if (!emailId) {
    return NextResponse.json(
      { success: false, error: { message: 'Email ID is required.', code: 400 } },
      { status: 400 }
    );
  }

  const result = await fetchEmail(emailId);

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: result.error.code || 500 });
  }

  return NextResponse.json({ success: true, data: result.data }, { status: 200 });
}
