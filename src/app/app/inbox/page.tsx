import Image from "next/image";

export default function Page() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Image
        src="/select-newsletter.png"
        alt="No newsletter selected"
        priority
        width={200}
        height={200}
      />
      <div className="space-y-1.5">
        <h4 className="text-foreground text-center text-xl font-bold">
          Select an email to dive in!
        </h4>
        <p className="text-muted-foreground text-center">
          Your newsletters are waiting. Pick one to catch up on the latest
          stories, insights, or updates.
        </p>
      </div>
    </div>
  );
}
