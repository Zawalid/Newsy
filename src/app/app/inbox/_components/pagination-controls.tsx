"use client";

import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "pageHistory";

export default function PaginationControls({
  nextPageToken,
  count,
}: {
  nextPageToken?: string | null;
  count: number;
}) {
  const [pageToken, setPageToken] = useQueryState("pageToken", { defaultValue: "" });
  const [pageHistory, setPageHistory] = useState<string[]>([]);

  // Load history from sessionStorage on mount
  useEffect(() => {
    const storedHistory = sessionStorage.getItem(STORAGE_KEY);
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory) as string[];
        setPageHistory(parsedHistory);
      } catch (err) {
        console.error("Error parsing stored page history:", err);
        setPageHistory([]);
      }
    } else {
      setPageHistory([]);
    }
  }, []);

  // Update history when pageToken changes
  useEffect(() => {
    setPageHistory((prevHistory) => {
      if (prevHistory.length === 0 || prevHistory[prevHistory.length - 1] !== pageToken) {
        const newHistory = [...prevHistory, pageToken];
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        return newHistory;
      }
      return prevHistory;
    });
  }, [pageToken]);

  const onPreviousPage = () => {
    if (pageHistory.length <= 1) return;

    const newHistory = [...pageHistory];
    newHistory.pop(); // Remove current page
    const prevToken = newHistory[newHistory.length - 1] || null;

    setPageHistory(newHistory);
    setPageToken(prevToken, { shallow: true });
  };

  const onNextPage = () => {
    if (!nextPageToken) return;
    setPageToken(nextPageToken, { shallow: true });
  };

  return (
    <div className="self-end flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Showing {count} emails</span>
      <Button
        variant="outline"
        className="size-5 p-2"
        onClick={onPreviousPage}
        disabled={pageHistory.length <= 1}
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
