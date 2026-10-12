import { requirePageUser } from "@/lib/auth";
import { getInbox } from "@/lib/repo";
import { Inbox } from "./inbox";

export const metadata = { title: "Inbox" };

export default async function InboxPage() {
  const user = await requirePageUser();
  return <Inbox initial={await getInbox(user.id)} />;
}
