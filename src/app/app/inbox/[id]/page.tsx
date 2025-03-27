import Image from "next/image";
import { fetchEmail } from "@/lib/gmail/fetcher";
import { EmailDisplay } from "../_components/email-display";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const { data, error } = await fetchEmail(id);

  if (error) return { title: error.code === 404 ? "Email Not Found" : "Something Went Wrong" };

  return { title: data?.subject || "Newsy | Inbox" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const { data, error } = await fetchEmail(id);

  if (error) return error.code === 404 ? <EmailNotFound /> : <Error />;
  if (!data) return <EmailNotFound />;

  return <EmailDisplay email={data} />;
}

function EmailNotFound() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <Image src="/404.png" alt="Email not found" width={350} height={200} />
      <div className="space-y-1.5">
        <h4 className="text-center text-xl font-bold text-foreground">Email Not Found</h4>
        <p className="text-center text-muted-foreground">
          We couldn&apos;t find the email you were looking for. It might have been moved or deleted.
        </p>
      </div>
    </div>
  );
}

function Error() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <Image src="/error.png" alt="Email not found" width={200} height={200} />
      <div className="space-y-1.5">
        <h4 className="text-center text-xl font-bold text-foreground">
          Oops! Something went wrong
        </h4>
        <p className="text-center text-muted-foreground">
          There was an error loading the email. Please try again later.
        </p>
      </div>
    </div>
  );
}
