'use client'

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Sidebar from "./_components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useState("");
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const pageToken = searchParams.get("pageToken") || undefined;

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout:inbox=${JSON.stringify(sizes)}; path=/`;
      }}
      className="h-full max-h-[calc(100vh-56px)] items-stretch"
    >
      <ResizablePanel defaultSize={25} minSize={25}>
        <Tabs className="h-full flex flex-col" defaultValue="all">
          <div className="px-4 py-2">
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
          </div>
          <Separator />
          <div className="p-4">
            <Sidebar searchQuery={searchQuery} filterQuery={filter} pageToken={pageToken} />
          </div>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75} minSize={40} className="border-b">
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
