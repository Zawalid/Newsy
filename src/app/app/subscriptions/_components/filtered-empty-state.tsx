"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilteredEmptyStateProps {
  onClearFilters: () => void
}

export function FilteredEmptyState({ onClearFilters }: FilteredEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-primary/10 p-6 mb-4">
        <Search className="h-12 w-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No Matching Subscriptions</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn&apos;t find any subscriptions matching your current filters. Try adjusting your search or filters.
      </p>
      <Button variant="outline" onClick={onClearFilters}>
        Clear Filters
      </Button>
    </div>
  )
}
