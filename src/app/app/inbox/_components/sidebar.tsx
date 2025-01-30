"use client";

import { useEffect, useState } from "react";
import SearchForm from "./search-form";
import PaginationControls from "./pagination-controls";
import { EmailsList } from "./emails-list";

export default function Sidebar({ searchQuery, filterQuery, pageToken }) {
  const [emails, setEmails] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/emails?q=${searchQuery}
          `);
        // &pageToken=${pageToken}
        const data = await res.json();
        setEmails(data.emails || []);
        setNextPageToken(data.nextPageToken || null);
      } catch (error) {
        console.error("Failed to fetch emails:", error);
      }
      setLoading(false);
    };

    fetchEmails();
  }, [searchQuery, pageToken]);

  return (
    <div className="h-full flex flex-col">
      <SearchForm initialQuery={searchQuery} />

      {loading ? <div>Loading emails...</div> : <EmailsList emails={emails} />}
      <PaginationControls nextPageToken={nextPageToken} />
    </div>
  );
}
