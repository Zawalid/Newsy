"use client";

import { Input } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { EmailsList } from "./emails-list";

interface EmailProps {
  emails: Email[];
  defaultLayout: number[] | undefined;
  children: React.ReactNode;
}

export default function Inbox({ emails, defaultLayout = [25, 75], children }: EmailProps) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout:email=${JSON.stringify(sizes)}`;
      }}
      className="h-full max-h-[800px] items-stretch"
    >
      <ResizablePanel defaultSize={defaultLayout[0]} minSize={25}>
        <Tabs defaultValue="all">
          <div className="px-4 py-2">
            <TabsList className="w-full ml-auto">
              <TabsTrigger value="all" className="w-full text-zinc-600 dark:text-zinc-200">
                All mail
              </TabsTrigger>
              <TabsTrigger value="unread" className="w-full text-zinc-600 dark:text-zinc-200">
                Unread
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />
          <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <form>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-8" />
              </div>
            </form>
          </div>
          <TabsContent value="all" className="m-0">
            <EmailsList emails={emails} />
          </TabsContent>
          <TabsContent value="unread" className="m-0">
            <EmailsList emails={emails.filter((email) => !email.isRead)} />
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={40}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
