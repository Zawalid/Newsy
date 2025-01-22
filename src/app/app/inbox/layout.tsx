import axios from "axios";
import { cookies } from "next/headers";
import Inbox from "./_components/inbox";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const layout = (await cookies()).get("react-resizable-panels:layout:mail");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  const res = await axios.get(new URL(process.env.NEXT_PUBLIC_BASE_URL + "/api/emails").toString());
  const emails = res.data.emails;

  // console.log(res.data);

  return (
    <Inbox emails={emails} defaultLayout={defaultLayout}>
      {children}
    </Inbox>
  );
}
