import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import '@/styles/globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { LoaderCircle } from 'lucide-react';
import Providers from './providers';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Newsy',
  description: 'Application for generating QCM',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body className={`${roboto.variable} ${robotoMono.variable} overflow-hidden antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
          <Providers>{children}</Providers>
          <Toaster
            position='top-right'
            icons={{
              loading: <LoaderCircle className='text-muted-foreground animate-spin text-lg' />,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
