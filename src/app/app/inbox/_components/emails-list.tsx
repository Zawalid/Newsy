"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmailsListSkeleton } from "./loading-skeletons";

function renderEmptyState(filter: string, query: string) {
  const emptyState: Record<string, { alt: string; heading: string; description: string }> = {
    "is:unread": {
      alt: "No unread emails",
      heading: "You’re all set! 🎉 No unread emails waiting for you.",
      description: "Take a break or explore something new while waiting for updates.",
    },
    "is:important": {
      alt: "No important emails",
      heading: "No important emails found.",
      description: "Mark emails as important to easily find them here.",
    },
    "is:starred": {
      alt: "No starred emails",
      heading: "No starred emails yet.",
      description: "Star emails to easily find them later.",
    },
    "is:read": {
      alt: "No read emails",
      heading: "You haven’t read any emails yet.",
      description: "Check your inbox and catch up on your messages.",
    },
    "": {
      alt: "No emails",
      heading: "No emails found.",
      description: "Try adjusting your filters or search for something else.",
    },
    "no-results": {
      alt: "No results found",
      heading: `No results found for "${query}"`,
      description: "Try searching for something else or adjust your filters.",
    },
  };

  const { alt, heading, description } = emptyState[query.length ? "no-results" : filter];

  return (
    <div className="flex flex-col gap-3 h-full items-center justify-center">
      <Image
        src={query.length ? "/no-results.png" : "/empty-inbox.png"}
        alt={alt}
        width={160}
        height={160}
      />
      <div className="space-y-1.5">
        <h4 className="text-center font-medium text-foreground">{heading}</h4>
        <p className="text-center text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
type EmailsListProps = {
  emails: Email[];
  isLoading: boolean;
  query: string;
  filter: string;
};
export function EmailsList({ emails, isLoading, query, filter }: EmailsListProps) {
  const { id } = useParams();
  const [parent] = useAutoAnimate();
  const searchParams = useSearchParams();

  if (isLoading) return <EmailsListSkeleton />;
  if (!emails.length) return renderEmptyState(filter, query.trim());

  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <div className="flex flex-col gap-2" ref={parent}>
        {emails.map((email) => (
          <Link
            href={`/app/inbox/${email.id}${
              searchParams.toString() ? `?${searchParams.toString()}` : ""
            }`}
            key={email.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              id === email.id && "bg-muted"
            )}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <HighlightText
                    className="font-bold"
                    text={email.from?.name || ""}
                    query={query}
                  />
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
              <HighlightText
                className="text-xs text-wrap line-clamp-1 font-medium"
                text={email.subject || ""}
                query={query}
              />
            </div>
            <HighlightText
              className="line-clamp-2 break-all whitespace-normal text-xs text-muted-foreground"
              text={email.snippet}
              query={query}
            />
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
}

interface HighlightTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  query: string;
}

function HighlightText({ text, query, ...props }: HighlightTextProps) {
  if (!query.trim()) return <span {...props}>{text}</span>;

  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return (
    <span {...props}>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} className="bg-yellow-300 text-black px-1 py-[1px]">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
}
