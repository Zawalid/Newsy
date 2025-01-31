"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import SearchForm from "./search-form";
import PaginationControls from "./pagination-controls";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { EmailsList } from "./emails-list";
import { useEmails } from "@/hooks/useEmails";

interface InboxProps {
  defaultLayout: number[] | undefined;
  children: React.ReactNode;
}

export default function Inbox({ children, defaultLayout = [25, 75] }: InboxProps) {
  const [filter, setFilter] = useState<"" | "is:unread">("");
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const pageToken = searchParams.get("pageToken") || undefined;

  const [parent] = useAutoAnimate();
  const { emails, nextPageToken, isLoading } = useEmails(`${searchQuery}${filter}`, pageToken);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout:inbox=${JSON.stringify(sizes)}; path=/`;
      }}
      className="h-full max-h-[calc(100vh-56px)] items-stretch"
    >
      <ResizablePanel defaultSize={defaultLayout[0]} minSize={25} className="h-full flex flex-col">
        <Tabs defaultValue="all" className="p-3">
          <TabsList className="w-full ml-auto">
            <TabsTrigger
              value="all"
              className="w-full text-zinc-600 dark:text-zinc-200"
              onClick={() => setFilter("")}
            >
              All emails
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="w-full text-zinc-600 dark:text-zinc-200"
              onClick={() => setFilter("is:unread")}
            >
              Unread
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Separator />
        <div className="p-3 flex flex-col gap-3" ref={parent}>
          <SearchForm initialQuery={searchQuery} />
          <PaginationControls nextPageToken={nextPageToken} />
        </div>
        <Separator />
        <div className="p-3 flex-1">
          <EmailsList
            emails={emails || []}
            isLoading={isLoading}
            searchQuery={searchQuery}
            filter={filter}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={40} className="border-b">
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
