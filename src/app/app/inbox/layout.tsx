import { cookies } from "next/headers";
import Inbox from "./_components/inbox";
import { listEmails } from "@/lib/gmail/emails";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const layout = (await cookies()).get("react-resizable-panels:layout:inbox");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  const { emails, error } = await listEmails("query", 5);

  if (error) {
    console.log(error);
    return <div>Error: {error.message}</div>;
  }

  console.log("emails", emails?.length);

  return (
    <Inbox emails={emails || []} defaultLayout={defaultLayout}>
      {children}
    </Inbox>
  );
}
