import Image from "next/image";
import axios, { AxiosError } from "axios";
import { EmailDisplay } from "../_components/email-display";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const res = await axios.get(
      new URL(process.env.NEXT_PUBLIC_BASE_URL + "/api/emails/" + id).toString()
    );

    return <EmailDisplay email={res.data} />;
  } catch (e) {
    if ((e as AxiosError).status === 404) return <EmailNotFound />;
    return <Error />;
  }
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
