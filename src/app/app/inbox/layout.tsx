import { cookies } from 'next/headers';
import Inbox from './_components/inbox';
import { fetchEmails } from '@/lib/gmail/operations';
import { DEFAULT_EMAILS_DISPLAYED } from '@/utils/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Inbox',
  description: 'Your newsletters are waiting. Pick one to catch up on the latest stories, insights, or updates.',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const layout = (await cookies()).get('react-resizable-panels:layout:inbox');
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  const result = await fetchEmails('', DEFAULT_EMAILS_DISPLAYED, undefined);

  if (!result.success) {
    return <div>Error: {result.error.message}</div>;
  }

  return (
    <Inbox defaultLayout={defaultLayout} placeholderData={result}>
      {children}
    </Inbox>
  );
}
