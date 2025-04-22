import { createAuthClient } from "better-auth/react";
import { oneTapClient } from "better-auth/client/plugins";
import { toast } from "sonner";
import { env } from "@/env";

export const client = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [oneTapClient({ clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID! ,})],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) toast.error("Too many requests. Please try again later.");
    },
  },
});

export const { signIn, signUp, signOut, useSession } = client;

client.$store.listen("$sessionSignal", async () => {});
