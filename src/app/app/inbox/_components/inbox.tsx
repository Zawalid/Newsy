"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import SearchForm from "./search-form";
import PaginationControls from "./pagination-controls";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { EmailsList } from "./emails-list";
import { useEmails } from "@/hooks/useEmails";
import { FilterTabs } from "./filter-tabs";

interface InboxProps {
  children: React.ReactNode;
  defaultLayout: number[] | undefined;
  placeholderData: EmailsListResponse | undefined;
}

const FILTER_OPTIONS = [
  { value: "is:unread", label: "Unread" },
  { value: "is:read", label: "Read" },
  { value: "is:important", label: "Important" },
  { value: "is:starred", label: "Starred" },
];

const getQuery = (filters: string[]) => (filters.length > 0 ? filters.join(" ") : "");

export default function Inbox({ children, defaultLayout = [25, 75], placeholderData }: InboxProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const pageToken = searchParams.get("pageToken") || undefined;

  const [parent] = useAutoAnimate();
  const { emails, nextPageToken, isLoading, isFetching } = useEmails(
    `${searchQuery} ${getQuery(selectedFilters)}`,
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
        <FilterTabs selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
        <Separator />
        <div className="p-3 flex flex-col gap-3" ref={parent}>
          <SearchForm initialQuery={searchQuery} isLoading={isFetching} />
          <PaginationControls nextPageToken={nextPageToken} />
        </div>
        <Separator />
        <div className="p-3 flex-1">
          <EmailsList
            emails={emails || []}
            isLoading={isLoading}
            searchQuery={searchQuery}
            filter={
              selectedFilters.length > 1 || selectedFilters.length === 0 ? "" : selectedFilters[0]
            }
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
