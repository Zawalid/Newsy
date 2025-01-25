import Image from "next/image";

export default function Page() {
  return (
    <div className="flex flex-col  h-full items-center justify-center">
      <Image src="/select-newsletter.png" alt="No newsletter selected" width={200} height={200} />
      <div className="space-y-1.5">
        <h4 className="text-center text-xl font-bold text-foreground">
          Select an email to dive in!
        </h4>
        <p className="text-center text-muted-foreground">
          Your newsletters are waiting. Pick one to catch up on the latest stories, insights, or updates.
        </p>
      </div>
    </div>
  );
  
}
