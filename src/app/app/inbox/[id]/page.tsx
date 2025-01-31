import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { EmailDisplay } from "../_components/email-display";
import { getEmail } from "@/queries/emailsQueries";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({ queryKey: ["email", id], queryFn: () => getEmail(id) });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmailDisplay id={id} />
    </HydrationBoundary>
  );

  // if (error) {
  //   if (error.code === 404) return <EmailNotFound />;
  //   return <Error />;
  // }
  // return <EmailDisplay email={email || null} />;
}
