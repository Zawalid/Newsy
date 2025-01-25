"use client";

import { useState } from "react";
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
}

export default function Inbox({ emails, defaultLayout = [25, 75], children }: EmailProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Email>[] = [
    {
      accessorKey: "from",
      accessorFn: (row) => row.from?.[0]?.name,
    },
    {
      accessorKey: "subject",
    },
    {
      accessorKey: "date",
    },
    {
      accessorKey: "isRead",
    },
  ];

  const table = useReactTable({
    data: emails,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout:inbox=${JSON.stringify(sizes)}`;
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
            <Toolbar table={table} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
          </div>

          <EmailsList
            emails={table.getRowModel().rows.map(r => r.original)}
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
};

function Toolbar({ table, globalFilter, setGlobalFilter }: Props) {
  const [parent] = useAutoAnimate();

  return (
    <div className="flex flex-col gap-3" ref={parent}>
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
      {table.getFilteredRowModel().rows.length > 0 && (
        <div className="self-end flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length}
          </span>
          <Button
            variant="outline"
            className="size-5  p-2"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="size-5  p-2"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
