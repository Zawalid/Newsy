import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { performEmailAction } from "@/lib/queries/emailsQueries";
import { useEmailsSearchAndFilters } from "./use-emails-search-filters";

type EmailUpdate = Partial<Pick<Email, "isRead" | "isStarred" | "isImportant">>;

const actionToFilterMap: Partial<Record<EmailAction, string>> = {
  unstar: "is:starred",
  markAsRead: "is:unread",
  markAsUnread: "is:read",
};

export function useEmailActions() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { filters, query, pageToken } = useEmailsSearchAndFilters();

  // Checks if action would make email match the current filter (to add it)
  const shouldAddToView = (action: EmailAction): boolean => {
    if (action === "moveToTrash") return false;
    if (filters.length === 0) return true; // No filters, always add

    const affectedFilter = actionToFilterMap[action];
    if (!affectedFilter) return true;

    return !filters.includes(affectedFilter);
  };

  // Checks if action would make the email no longer match any current filter
  const shouldRemoveFromView = (
    action: EmailAction,
    emailId: string,
    update?: EmailUpdate,
  ): boolean => {
    if (filters.length === 0) return false;

    const affectedFilter = actionToFilterMap[action];
    if (!affectedFilter) return false;

    const filterIsActive = filters.includes(affectedFilter);
    if (!filterIsActive) return false;

    // For combined filters, we need to check if email would still match other filters
    if (filters.length > 1) {
      const email = queryClient.getQueryData(["email", emailId]) as
        | Email
        | undefined;
      if (!email) return true; // If we can't find the email, assume we should remove

      const updatedEmail = { ...email, ...update };

      const wouldMatchOtherFilters = filters.some((filter) => {
        if (filter === affectedFilter) return false; // Skip the affected filter

        // Check if email would match other filters
        return (
          (filter === "is:starred" && updatedEmail.isStarred) ||
          (filter === "is:unread" && !updatedEmail.isRead) ||
          (filter === "is:read" && updatedEmail.isRead) ||
          (filter === "is:important" && updatedEmail.isImportant)
        );
      });

      return !wouldMatchOtherFilters;
    }

    // For single filter, simply remove if the filter is affected
    return true;
  };

  // Update query cache across different query keys
  const updateEmailsCache = (
    operation: "add" | "remove" | "update",
    emailId: string,
    update?: EmailUpdate,
  ) => {
    // Common function to apply updates to different query keys
    const applyToQueryCache = (queryKey: any[]) => {
      queryClient.setQueriesData({ queryKey }, (oldData: any) => {
        if (!oldData?.emails) return oldData;

        if (operation === "remove") {
          return {
            ...oldData,
            emails: oldData.emails.filter(
              (email: Email) => email.id !== emailId,
            ),
          };
        } else if (operation === "update") {
          return {
            ...oldData,
            emails: oldData.emails.map((email: Email) =>
              email.id === emailId ? { ...email, ...update } : email,
            ),
          };
        } else if (operation === "add") {
          // Get the email data if not in the cache already
          const emailData = queryClient.getQueryData(["email", emailId]) as
            | Email
            | undefined;
          if (!emailData) return oldData;

          const updatedEmail = { ...emailData, ...update };

          // Check if email already exists
          const emailExists = oldData.emails.some(
            (email: Email) => email.id === emailId,
          );
          if (emailExists) return oldData;

          return { ...oldData, emails: [updatedEmail, ...oldData.emails] };
        }

        return oldData;
      });
    };

    // Update all relevant email lists
    applyToQueryCache(["emails"]);

    // Handle query key structure: ["emails", query, pageToken]
    if (query || pageToken) applyToQueryCache(["emails", query, pageToken]);

    // For individual email updates
    if (operation === "update" && update) {
      queryClient.setQueryData(["email", emailId], (oldData: any) => {
        if (!oldData) return oldData;
        return { ...oldData, ...update };
      });
    }
  };

  const executeEmailAction = async (
    action: EmailAction,
    emailId: string,
    update?: EmailUpdate,
    errorMessage?: string,
  ) => {
    // Apply optimistic updates to cache
    if (update) updateEmailsCache("update", emailId, update);

    console.log(action);
    // Check if email should be added or removed from current view
    if (
      shouldRemoveFromView(action, emailId, update) ||
      action === "moveToTrash"
    ) {
      console.log("remove");
      updateEmailsCache("remove", emailId);
    } else if (update && shouldAddToView(action)) {
      console.log("add");
      updateEmailsCache("add", emailId, update);
    }

    // Perform the server action
    const result = await performEmailAction(action, emailId);

    // Handle errors
    if ("message" in result) {
      toast.error(errorMessage || `Error performing action`, {
        description: result.message,
      });

      // Invalidate caches to ensure they're up to date
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      if (action !== "moveToTrash") {
        queryClient.invalidateQueries({ queryKey: ["email", emailId] });
      }
    }

    return result;
  };

  return {
    markAsRead: (emailId: string) =>
      executeEmailAction(
        "markAsRead",
        emailId,
        { isRead: true },
        "Error marking email as read",
      ),

    markAsUnread: (emailId: string) =>
      executeEmailAction(
        "markAsUnread",
        emailId,
        { isRead: false },
        "Error marking email as unread",
      ),

    starEmail: (emailId: string) =>
      executeEmailAction(
        "star",
        emailId,
        { isStarred: true },
        "Error starring email",
      ),

    unstarEmail: (emailId: string) =>
      executeEmailAction(
        "unstar",
        emailId,
        { isStarred: false },
        "Error unstarring email",
      ),

    moveToTrash: async (emailId: string, redirectAfterDelete = false) => {
      if (redirectAfterDelete) {
        const searchParams = new URLSearchParams(window.location.search);
        router.replace("/app/inbox?" + searchParams.toString());
      }
      return executeEmailAction(
        "moveToTrash",
        emailId,
        undefined,
        "Error deleting email",
      );
    },
  };
}
