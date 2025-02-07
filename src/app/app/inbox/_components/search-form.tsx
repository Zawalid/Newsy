"use client";

import { useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { LoaderCircle, MailSearch, Search } from "lucide-react";

export default function SearchForm({ isLoading }: { isLoading: boolean }) {
  const [query, setQuery] = useQueryState("q", { defaultValue: "" });

  return (
    <form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        setQuery(query);
      }}
    >
      <Input
        className="peer pe-9 ps-9"
        placeholder="Search emails..."
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
        {isLoading ? (
          <LoaderCircle
            className="animate-spin"
            size={16}
            strokeWidth={2}
            role="status"
            aria-label="Loading..."
          />
        ) : (
          <Search size={16} strokeWidth={2} aria-hidden="true" />
        )}
      </div>
      <button
        className="absolute bg-secondary inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-foreground outline-offset-2 transition-colors hover:bg-secondary/70 focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Press to search"
        type="submit"
      >
        <MailSearch size={18} strokeWidth={2} aria-hidden="true" />
      </button>
    </form>
  );
}
