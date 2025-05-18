"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { RefreshCw } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import SearchForm from "./search-form";
import PaginationControls from "./pagination-controls";
import { EmailsList } from "./emails-list";
import { FilterTabs } from "./filter-tabs";
import { Button } from "@/components/ui/button";
import { useEmails } from "../hooks/use-emails";
import { useEmailsSearchAndFilters } from "../hooks/use-emails-search-filters";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
interface InboxProps {
  children: React.ReactNode;
  defaultLayout: number[] | undefined;
  placeholderData: APIResult<EmailsListResponse>;
}

export default function Inbox({
  children,
  defaultLayout = [25, 75],
  placeholderData,
}: InboxProps) {
  const { filters, setFilters, query, pageToken } = useEmailsSearchAndFilters();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { id } = useParams();
  const [parent] = useAutoAnimate({ duration: 500 });
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { emails, nextPageToken, isLoading, isFetching, invalidate } =
    useEmails(query, pageToken, placeholderData);

  useEffect(() => {
    if (isMobile) setIsCollapsed(id !== null);
    else setIsCollapsed(false);
  }, [id, isMobile]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout:inbox=${JSON.stringify(sizes)}; path=/`;
        window.dispatchEvent(new Event("panels-resized"));
      }}
      className="h-full max-h-[calc(100vh-56px)] items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        minSize={25}
        maxSize={50}
        className={cn("border-r", isCollapsed && "hidden md:block")}
        collapsible={true}
        collapsedSize={0}
        onCollapse={() => setIsCollapsed(true)}
        onExpand={() => setIsCollapsed(false)}
      >
        <div className="flex h-full flex-col gap-y-3 p-3 [&>div]:min-w-[345px]">
          <FilterTabs filters={filters} setFilters={setFilters} />
          <Separator />
          <div className="flex flex-col gap-3" ref={parent}>
            <div className="flex items-center gap-1">
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
            <PaginationControls
              nextPageToken={nextPageToken}
              count={emails?.length || 0}
            />
          </div>
          <Separator />
          <EmailsList
            emails={emails || []}
            isLoading={isLoading}
            filter={
              filters.length > 1 || filters.length === 0 ? "" : filters[0]
            }
          />
        </div>
      </ResizablePanel>
      {!isMobile && <ResizableHandle withHandle />}

      <ResizablePanel
        defaultSize={defaultLayout[1]}
        minSize={40}
        className="border-b"
      >
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
