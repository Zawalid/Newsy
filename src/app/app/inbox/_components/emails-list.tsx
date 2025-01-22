import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useParams } from "next/navigation";

export function EmailsList({ emails }: { emails: Email[] }) {
  const { id } = useParams();

  if (!emails.length) {
    return <div className=""></div>;
  }

  return (
    <ScrollArea>
      <div className="flex flex-col gap-2 px-3 py-4">
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
