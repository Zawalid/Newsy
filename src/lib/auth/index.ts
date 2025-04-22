import { betterAuth } from "better-auth";
import { oneTap, openAPI } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { env } from "@/env";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { accounts, users, sessions, verifications } from "@/db/schema";

export const auth = betterAuth({
  appName: "Newsy",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user: users, account: accounts, session: sessions, verification: verifications },
  }),
  socialProviders: {
    google: {
      clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.labels",
        "https://www.googleapis.com/auth/gmail.modify",
      ],
      accessType: "offline",
      prompt: "consent",
    },
  },
  account: { accountLinking: { trustedProviders: ["google"] } },
  //   databaseHooks: { user: { create: {} } },
  plugins: [oneTap(), openAPI(), nextCookies()],
});

export const getSession = async () => await auth.api.getSession({ headers: await headers() });
