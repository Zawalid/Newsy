"use client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import SearchForm from "./search-form";
import PaginationControls from "./pagination-controls";
import { EmailsList } from "./emails-list";
import { FilterTabs } from "./filter-tabs";
import { useEmails } from "@/hooks/use-emails";
import { useDebounce } from "@/hooks/use-debounce";

interface InboxProps {
  children: React.ReactNode;
  defaultLayout: number[] | undefined;
  placeholderData: EmailsListResponse | undefined;
}

const getQuery = (filters: string[]) => (filters.length > 0 ? filters.join(" ") : "");

export default function Inbox({ children, defaultLayout = [25, 75], placeholderData }: InboxProps) {
  const [selectedFilters, setSelectedFilters] = useQueryState(
    "filters",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [query] = useQueryState("q", { defaultValue: "" });
  const [pageToken] = useQueryState("pageToken");

  const [parent] = useAutoAnimate();

  const { emails, nextPageToken, isLoading, isFetching } = useEmails(
    useDebounce(`${query} ${getQuery(selectedFilters)}`, 500),
    pageToken || undefined,
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
          <SearchForm isLoading={isFetching} />
          <PaginationControls nextPageToken={nextPageToken} count={emails?.length || 0} />
        </div>
        <Separator />
        <div className="p-3 flex-1">
          <EmailsList
            emails={emails || []}
            isLoading={isLoading}
            query={query}
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
