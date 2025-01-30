"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaginationControls({ nextPageToken }: { nextPageToken?: string | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pageHistory, setPageHistory] = useState<string[]>([]);

  // Maintain page history stack
  useEffect(() => {
    const currentToken = searchParams.get("pageToken");
    if (currentToken && !pageHistory.includes(currentToken)) {
      setPageHistory((prev) => [...prev, currentToken]);
    }
  }, [pageHistory, searchParams]);

  const onPreviousPage = () => {
    const newHistory = [...pageHistory];
    newHistory.pop(); // Remove current page
    const prevToken = newHistory.pop() || undefined; // Get previous page token

    const params = new URLSearchParams(searchParams);
    if (prevToken) {
      params.set("pageToken", prevToken);
    } else {
      params.delete("pageToken");
    }

    setPageHistory(newHistory);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const onNextPage = () => {
    if (!nextPageToken) return;

    const params = new URLSearchParams(searchParams);
    params.set("pageToken", nextPageToken);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="self-end flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Showing {20} results</span>
      <Button
        variant="outline"
        className="size-5 p-2"
        onClick={onPreviousPage}
        disabled={pageHistory.length <= 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="size-5 p-2"
        onClick={onNextPage}
        disabled={!nextPageToken}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
