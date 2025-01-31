import { cookies } from "next/headers";
import Inbox from "./_components/inbox";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getEmails } from "@/queries/emailsQueries";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const layout = (await cookies()).get("react-resizable-panels:layout:inbox");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["emails", "", undefined],
    queryFn: () => getEmails("", ""),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Inbox defaultLayout={defaultLayout}>{children}</Inbox>
    </HydrationBoundary>
  );
}
