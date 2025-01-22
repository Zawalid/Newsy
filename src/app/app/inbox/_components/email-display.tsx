"use client";

import { format } from "date-fns";
import root from "react-shadow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { sanitize } from "@/lib/utils";

export function EmailDisplay({ email }: { email: Email | null }) {
  return (
    <div className="flex h-full flex-col overflow-auto [&_img]:inline-block ">
      {email ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={email.from?.[0].name} />
                <AvatarFallback>
                  {email.from?.[0].name
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-bold">{email.from?.[0].name}</div>
                <div className="line-clamp-1 font-medium text-xs">{email.subject}</div>
                <div className="line-clamp-1 text-xs text-muted-foreground">
                  <span className="font-medium">Reply-To:</span> {email.from?.[0].address}
                </div>
              </div>
            </div>
            {email.date && (
              <div className="ml-auto text-xs font-medium text-muted-foreground">
                {format(new Date(email.date), "PPpp")}
              </div>
            )}
          </div>
          <Separator />

          <root.div className="flex-1">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  (email.body.html || "") ||
                  sanitize(email.body.text || "") ||
                  "<div class='text-muted'>No content</div>",
              }}
            />
          </root.div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">No message selected</div>
      )}
    </div>
  );
}
