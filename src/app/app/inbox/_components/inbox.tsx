"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  ColumnDef,
  Table,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { EmailsList } from "./emails-list";
import { Button } from "@/components/ui/button";
import { useAutoAnimate } from "@formkit/auto-animate/react";
interface EmailProps {
  emails: Email[];
  defaultLayout: number[] | undefined;
  children: React.ReactNode;
  nextPageToken?: string | null;
  prevPageToken?: string | null;
  searchQuery?: string;
}

const columns: ColumnDef<Email>[] = [
  { accessorKey: "from", accessorFn: (row) => row.from?.name },
  { accessorKey: "subject" },
  { accessorKey: "date" },
  { accessorKey: "isRead" },
];

export default function Inbox({
  emails,
  defaultLayout = [25, 75],
  children,
  nextPageToken,
  prevPageToken,
}: EmailProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const pageIndex = parseInt(searchParams.get("page") || "1", 10) - 1; // Convert 1-based to 0-based
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  // Debounced search
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     const params = new URLSearchParams(searchParams);
  //     params.set("q", globalFilter);
  //     params.delete("pageToken"); // Reset pagination on new search
  //     router.replace(`${pathname}?${params.toString()}`);
  //   }, 500);

  //   return () => clearTimeout(timeout);
  // }, [globalFilter, pathname, router, searchParams]);

  // Pagination handlers
  const handlePreviousPage = () => {
    const params = new URLSearchParams(searchParams);
    params.set("pageToken", prevPageToken!);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleNextPage = () => {
    const params = new URLSearchParams(searchParams);
    params.set("pageToken", nextPageToken!);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Simplified table config
  const table = useReactTable({
    columns,
    data: emails,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(emails.length / pageSize),
    state: { pagination: { pageIndex, pageSize } },
  });

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout:inbox=${JSON.stringify(sizes)}
        ; path=/`;
      }}
      className="h-full max-h-[calc(100vh-56px)] items-stretch"
    >
      <ResizablePanel defaultSize={defaultLayout[0]} minSize={25}>
        <Tabs className="h-full flex flex-col" defaultValue="all">
          <div className="px-4 py-2">
            <TabsList className="w-full ml-auto">
              <TabsTrigger
                value="all"
                className="w-full text-zinc-600 dark:text-zinc-200"
                onClick={() => setColumnFilters([])}
              >
                All emails
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="w-full text-zinc-600 dark:text-zinc-200"
                onClick={() => setColumnFilters([{ id: "isRead", value: false }])}
              >
                Unread
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />
          <div className="p-4">
            <Toolbar
              table={table}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
              hasPreviousPage={!!prevPageToken}
              hasNextPage={!!nextPageToken}
              totalResults={emails.length}
            />{" "}
          </div>

          <EmailsList
            emails={table.getRowModel().rows.map((r) => r.original)}
            searchQuery={globalFilter}
            unreadFilter={columnFilters.some(
              (filter) => filter.id === "isRead" && filter.value === false
            )}
          />
        </Tabs>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={40} className="border-b">
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

type Props = {
  table: Table<Email>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  totalResults: number;
};

function Toolbar({
  table,
  globalFilter,
  setGlobalFilter,
  onPreviousPage,
  onNextPage,
  hasPreviousPage,
  hasNextPage,
  totalResults,
}: Props) {
  const [parent] = useAutoAnimate();

  return (
    <div className="flex flex-col gap-3">
      <form>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            className="pl-8"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </form>
      <div className="self-end flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Showing {totalResults} results</span>
        <Button
          variant="outline"
          className="size-5 p-2"
          onClick={onPreviousPage}
          disabled={!hasPreviousPage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="size-5 p-2"
          onClick={onNextPage}
          disabled={!hasNextPage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
