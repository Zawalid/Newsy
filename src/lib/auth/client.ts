import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { toast } from 'sonner';
import { auth } from '.';

export const client = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) toast.error('Too many requests. Please try again later.');
    },
  },
});

export const { signIn, signUp, signOut, useSession } = client;

client.$store.listen('$sessionSignal', async () => {});
