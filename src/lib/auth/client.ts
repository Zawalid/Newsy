import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

export const client = createAuthClient({
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429)
        toast.error("Too many requests. Please try again later.");
    },
  },
});

export const { signIn, signUp, signOut, useSession } = client;

client.$store.listen("$sessionSignal", async () => {});
