import { NextRequest, NextResponse } from "next/server";
import { markEmailAsReadOrUnread, deleteEmail, untrashEmail } from "@/lib/gmail/operations";

export async function POST(req: NextRequest) {
  const { action, emailId, value } = await req.json();

  try {
    let result;

    switch (action) {
      case "markAsRead":
        result = await markEmailAsReadOrUnread(emailId, "READ");
        break;
      case "markAsUnread":
        result = await markEmailAsReadOrUnread(emailId, "UNREAD");
        break;
      case "delete":
        result = await deleteEmail(emailId, value === true);
        break;
      case "untrash":
        result = await untrashEmail(emailId);
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
