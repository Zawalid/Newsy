import { NextRequest, NextResponse } from "next/server";
import {
  markEmailAsReadOrUnread,
  moveEmailToTrash,
  untrashEmail,
  starEmail,
  unstarEmail,
} from "@/lib/gmail/operations";

export async function POST(req: NextRequest) {
  const { action, emailId, value } = await req.json();

  try {
    let result;

    switch (action as EmailAction) {
      case "markAsRead":
        result = await markEmailAsReadOrUnread(emailId, "READ");
        break;
      case "markAsUnread":
        result = await markEmailAsReadOrUnread(emailId, "UNREAD");
        break;
      case "moveToTrash":
        result = await moveEmailToTrash(emailId, value === true);
        break;
      case "removeFromTrash":
        result = await untrashEmail(emailId);
        break;
      case "star":
        result = await starEmail(emailId);
        break;
      case "unstar":
        result = await unstarEmail(emailId);
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if ("error" in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
