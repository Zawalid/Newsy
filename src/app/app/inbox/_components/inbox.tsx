"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { RefreshCw } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import SearchForm from "./search-form";
import PaginationControls from "./pagination-controls";
import { EmailsList } from "./emails-list";
import { FilterTabs } from "./filter-tabs";
import { useEmails } from "@/app/app/inbox/hooks/use-emails";
import { Button } from "@/components/ui/button";
import { useEmailsSearchAndFilters } from "../hooks/use-emails-search-filters";

interface InboxProps {
  children: React.ReactNode;
  defaultLayout: number[] | undefined;
  placeholderData: EmailsListResponse | undefined;
}

export default function Inbox({ children, defaultLayout = [25, 75], placeholderData }: InboxProps) {
  const { filters, setFilters, query, pageToken } = useEmailsSearchAndFilters();
  const [parent] = useAutoAnimate();

  const { emails, nextPageToken, isLoading, isFetching, invalidate } = useEmails(
    query,
    pageToken,
    placeholderData
  );

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout:inbox=${JSON.stringify(sizes)}; path=/`;
        window.dispatchEvent(new Event("panels-resized"));
      }}
      className="h-full max-h-[calc(100vh-56px)] items-stretch"
    >
      <ResizablePanel defaultSize={defaultLayout[0]} minSize={25} className="h-full flex flex-col">
        <FilterTabs filters={filters} setFilters={setFilters} />
        <Separator />
        <div className="p-3 flex flex-col gap-3" ref={parent}>
          <div className="flex gap-1 items-center ">
            <SearchForm className="flex-1" isLoading={isFetching} />
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              onClick={() => invalidate?.()}
              disabled={isLoading || isFetching}
              title="Refresh emails"
            >
              <RefreshCw className={`${isFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <PaginationControls nextPageToken={nextPageToken} count={emails?.length || 0} />
        </div>
        <Separator />
        <div className="p-3 flex-1">
          <EmailsList
            emails={emails || []}
            isLoading={isLoading}
            filter={filters.length > 1 || filters.length === 0 ? "" : filters[0]}
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
