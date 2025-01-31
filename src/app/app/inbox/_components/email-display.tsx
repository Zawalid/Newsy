"use client";

import { format } from "date-fns";
import root from "react-shadow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatEmailText, sanitize } from "@/lib/utils";
import { useEmail } from "@/hooks/useEmails";
import Image from "next/image";
import { EmailDisplaySkeleton } from "./loading-skeletons";

export function EmailDisplay({ id }: { id: string }) {
  const { email, isLoading, error } = useEmail(id);


  if (isLoading) return <EmailDisplaySkeleton />;
  if (error && error.code === 404) return <EmailNotFound />;
  if (error) return <Error />;

  return (
    <div className="flex h-full flex-col overflow-auto [&_img]:inline-block ">
      {email ? (
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
      ) : null}
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

function EmailNotFound() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <Image src="/404.png" alt="Email not found" width={350} height={200} />
      <div className="space-y-1.5">
        <h4 className="text-center text-xl font-bold text-foreground">Email Not Found</h4>
        <p className="text-center text-muted-foreground">
          We couldn&apos;t find the email you were looking for. It might have been moved or deleted.
        </p>
      </div>
    </div>
  );
}

function Error() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <Image src="/error.png" alt="Email not found" width={200} height={200} />
      <div className="space-y-1.5">
        <h4 className="text-center text-xl font-bold text-foreground">
          Oops! Something went wrong
        </h4>
        <p className="text-center text-muted-foreground">
          There was an error loading the email. Please try again later.
        </p>
      </div>
    </div>
  );
}
