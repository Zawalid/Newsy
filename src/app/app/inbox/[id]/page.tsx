import axios from "axios";
import { EmailDisplay } from "../_components/email-display";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const res = await axios.get(
    new URL(process.env.NEXT_PUBLIC_BASE_URL + "/api/emails/" + id).toString()
  );

  return <EmailDisplay email={res.data} />;
}
