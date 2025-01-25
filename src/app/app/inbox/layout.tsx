import axios from "axios";
import { cookies } from "next/headers";
import Inbox from "./_components/inbox";

export default async function Layout({ children }: { children: React.ReactNode }) {
  try {
    const layout = (await cookies()).get("react-resizable-panels:layout:inbox");
    const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

    const res = await axios.get(
      new URL(process.env.NEXT_PUBLIC_BASE_URL + "/api/emails").toString()
    );
    const emails = res.data.emails;

    return (
      <Inbox emails={emails} defaultLayout={defaultLayout}>
        {children}
      </Inbox>
    );
  } catch (e) {
    return <div>Error: {(e as Error).message}</div>;
  }
}
