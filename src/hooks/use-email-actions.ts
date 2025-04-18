import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { performEmailAction } from "@/queries/emailsQueries";

export function useEmailActions() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const markAsRead = async (emailId: string) => {
    updateEmailCache(emailId, (email) => ({ ...email, isRead: true }));

    const result = await performEmailAction("markAsRead", emailId);

    if ("message" in result) {
      toast.error("Error marking email as read", { description: result.message });
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      queryClient.invalidateQueries({ queryKey: ["email", emailId] });
    }
  };

  const markAsUnread = async (emailId: string) => {
    updateEmailCache(emailId, (email) => ({ ...email, isRead: false }));

    const result = await performEmailAction("markAsUnread", emailId);

    if ("message" in result) {
      toast.error("Error marking email as unread", { description: result.message });
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      queryClient.invalidateQueries({ queryKey: ["email", emailId] });
    }
  };

  const deleteEmail = async (emailId: string, redirectAfterDelete = false) => {
    removeEmailFromCache(emailId);

    if (redirectAfterDelete) router.replace("/app/inbox");

    const result = await performEmailAction("delete", emailId);

    if ("message" in result) {
      toast.error("Error deleting email", { description: result.message });
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    }
  };

  const updateEmailCache = (emailId: string, updater: (email: Email) => Email) => {
    queryClient.setQueriesData({ queryKey: ["emails"] }, (oldData: any) => {
      if (!oldData?.emails) return oldData;

      return {
        ...oldData,
        emails: oldData.emails.map((email: Email) =>
          email.id === emailId ? updater(email) : email
        ),
      };
    });

    queryClient.setQueryData(["email", emailId], (oldData: any) => {
      if (!oldData) return oldData;
      return updater(oldData);
    });
  };

  const removeEmailFromCache = (emailId: string) => {
    queryClient.setQueriesData({ queryKey: ["emails"] }, (oldData: any) => {
      if (!oldData?.emails) return oldData;

      return {
        ...oldData,
        emails: oldData.emails.filter((email: Email) => email.id !== emailId),
      };
    });
  };

  return {
    markAsRead,
    markAsUnread,
    deleteEmail,
  };
}
