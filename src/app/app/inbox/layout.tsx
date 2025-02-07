import { cookies } from "next/headers";
import Inbox from "./_components/inbox";
import { fetchEmails } from "@/lib/gmail/fetcher";
import { DISPLAYED_EMAILS_COUNT } from "@/utils/constants";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const layout = (await cookies()).get("react-resizable-panels:layout:inbox");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  const { data, error } = await fetchEmails("", DISPLAYED_EMAILS_COUNT, undefined);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Inbox defaultLayout={defaultLayout} placeholderData ={data}>
      {children}
    </Inbox>
  );
}
