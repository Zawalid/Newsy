'use client'

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

function renderEmptyState(
  imageSrc: string,
  altText: string,
  heading: string,
  description: string,
  imageSize: { width: number; height: number }
) {
  return (
    <div className="flex flex-col px-3 h-full items-center justify-center">
      <Image src={imageSrc} alt={altText} width={imageSize.width} height={imageSize.height} />
      <div className="space-y-1.5">
        <h4 className="text-center font-medium text-foreground">{heading}</h4>
        <p className="text-center text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

type Props = {
  emails: Email[];
  searchQuery: string;
  unreadFilter: unknown;
};

export function EmailsList({ emails, searchQuery, unreadFilter }: Props) {
  const { id } = useParams();
  const [parent] = useAutoAnimate();

  if (!emails.length) {
    if (unreadFilter === true && !searchQuery.trim().length) {
      return renderEmptyState(
        "/no-unread.png",
        "No unread emails",
        "You’re all set! 🎉 No unread emails waiting for you.",
        "Take a break or explore something new while waiting for updates.",
        { width: 160, height: 160 }
      );
    }
    if (searchQuery.trim().length) {
      return renderEmptyState(
        "/no-results-found.png",
        "No results",
        `No results found for "${searchQuery}"`,
        "Try searching for something else or reset the search query.",
        { width: 160, height: 160 }
      );
    }
    return renderEmptyState(
      "/empty-mail.png",
      "No emails",
      "Nothing to read right now.",
      "Your inbox is clear for now. New updates will appear here as soon as they arrive.",
      { width: 240, height: 240 }
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-180px)]">
      <div className="flex flex-col  gap-2 px-3" ref={parent}>
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
