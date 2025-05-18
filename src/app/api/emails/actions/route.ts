import { NextRequest, NextResponse } from 'next/server';
import {
  markEmailAsReadOrUnread,
  moveEmailToTrash,
  untrashEmail,
  starEmail,
  unstarEmail,
} from '@/lib/gmail/operations';
import { getUserIdFromSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ success: false, error: { message: 'Unauthorized', code: 401 } }, { status: 401 });
  }

  const { action, emailId, value } = await req.json();

  try {
    let result;

    switch (action as EmailAction) {
      case 'markAsRead':
        result = await markEmailAsReadOrUnread(emailId, 'READ');
        break;
      case 'markAsUnread':
        result = await markEmailAsReadOrUnread(emailId, 'UNREAD');
        break;
      case 'moveToTrash':
        result = await moveEmailToTrash(emailId, value === true);
        break;
      case 'removeFromTrash':
        result = await untrashEmail(emailId);
        break;
      case 'star':
        result = await starEmail(emailId);
        break;
      case 'unstar':
        result = await unstarEmail(emailId);
        break;

      default:
        return NextResponse.json({ success: false, error: { message: 'Invalid action', code: 400 } }, { status: 400 });
    }

    if ('error' in result && result.error) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.error.code || 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message, code: 500 } }, { status: 500 });
  }
}
