"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  BreadcrumbPage,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <SidebarProvider
      defaultOpen={false}
      style={{ "--sidebar-width": "300px" } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset className="overflow-auto">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    {isMobile ? (
                      <button
                        className="hover:text-muted-foreground flex items-center gap-1 transition-colors duration-300"
                        onClick={() => router.push("/app/inbox")}
                      >
                        <ChevronLeft />
                        <div className="font-medium">Back to inbox</div>
                      </button>
                    ) : (
                      "Inbox"
                    )}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3" id="actions"></div>
        </header>
        <div className="flex flex-1 flex-col gap-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
