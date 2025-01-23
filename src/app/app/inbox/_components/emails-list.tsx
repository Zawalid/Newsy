import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

export function EmailsList({ emails, type }: { emails: Email[]; type: "all" | "unread" }) {
  const { id } = useParams();

  if (!emails.length) {
    if (type === "unread") {
      return (
        <div className="flex flex-col gap-5 h-full items-center justify-center ">
          <Image src="/no_unread.svg" alt="No unread emails" width={100} height={100} />
          <div className="space-y-1.5">
            <h4 className="text-center font-medium text-foreground">
              You&apos;re all set! 🎉 No unread emails waiting for you.
            </h4>
            <p className="text-center text-sm text-muted-foreground">
              Take a break or explore something new while waiting for updates.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-5 h-full items-center justify-center">
        <Image src="/empty_inbox.svg" alt="Empty inbox illustration" width={120} height={120} />
        <div className="space-y-2 text-center">
          <h4 className="font-medium text-foreground">Your inbox is empty.</h4>
          <p className="text-sm text-muted-foreground">
            Enjoy your day or check back later for new messages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-180px)]">
      <div className="flex flex-col  gap-2 px-3">
        {emails.map((email) => (
          <Link
            href={`/app/inbox/${email.id}`}
            key={email.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              id === email.id && "bg-muted"
            )}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-bold">{email.from?.[0].name}</div>
                  {!email.isRead && <span className="flex h-2 w-2 rounded-full bg-blue-600" />}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    id === email.id ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {email.date &&
                    formatDistanceToNow(new Date(email.date), {
                      addSuffix: true,
                    })}
                </div>
              </div>
              <div className="text-xs text-wrap line-clamp-1 font-medium">{email.subject}</div>
            </div>
            <div className="line-clamp-2 whitespace-break-spaces text-xs text-muted-foreground">
              {email.snippet}
            </div>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
}
