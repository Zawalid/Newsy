import Image from "next/image";
import { EmailDisplay } from "../_components/email-display";
import { getEmail } from "@/lib/gmail/emails";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const { data: email, error } = await getEmail(id);

  if (error) {
    if (error.code === 404) return <EmailNotFound />;
    return <Error />;
  }
  return <EmailDisplay email={email || null} />;
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
