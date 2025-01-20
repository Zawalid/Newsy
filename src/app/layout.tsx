import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import TopLoader from "@/components/top-loader";
import { Toaster } from "@/components/ui/sonner";
import { LoaderCircle } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QCMaker",
  description: "Application for generating QCM",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TopLoader />
          {children}
          <Toaster
            position="top-right"
            icons={{
              loading: <LoaderCircle className="animate-spin text-lg text-muted-foreground" />,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
