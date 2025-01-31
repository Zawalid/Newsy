"use client";

import { format } from "date-fns";
import root from "react-shadow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatEmailText, sanitize } from "@/lib/utils";

export function EmailDisplay({ email }: { email: Email }) {
  return (
    <div className="flex h-full flex-col overflow-auto [&_img]:inline-block ">
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between items-baseline gap-10 p-4">
          <div className="flex items-start gap-5">
            <div className="grid gap-4">
              <h3 className="font-medium text-xl">{email.subject}</h3>
              <div className="flex items-center gap-3 ">
                <Avatar>
                  <AvatarImage alt={email.from?.name} />
                  <AvatarFallback>
                    {email.from?.name
                      ?.split(" ")
                      .map((chunk) => chunk[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="">
                  <div className="flex items-center gap-2">
                    <p className="line-clamp-1 font-bold text-sm">{email.from?.name}</p>
                    <span className="font-medium text-xs">{`<${email.from?.address}>`}</span>
                  </div>
                  <div className="line-clamp-1 text-muted-foreground text-xs">
                    <span className="font-medium">To:</span> {email.to?.address}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {email.date && (
            <div className="text-nowrap text-xs font-medium text-muted-foreground">
              {format(new Date(email.date), "PPpp")}
            </div>
          )}
        </div>
        <Separator />
        <EmailBody body={email.body} />
      </div>
    </div>
  );
}

export default function EmailBody({ body }: { body: Email["body"] }) {
  if (!body) return null;

  if (body.html)
    return (
      <root.div className="flex-1">
        <div dangerouslySetInnerHTML={{ __html: sanitize(body.html) || "" }} />
      </root.div>
    );

  if (body.text)
    return (
      <div
        dangerouslySetInnerHTML={{ __html: formatEmailText(body.text || "") }}
        className="whitespace-pre-wrap break-words text-base text-muted-foreground leading-relaxed p-4"
      ></div>
    );

  return <div className="text-muted-foreground">No content</div>;
}
