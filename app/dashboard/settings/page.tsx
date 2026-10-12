import { requirePageUser } from "@/lib/auth";
import { AccountSettings } from "./account";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requirePageUser();
  return <AccountSettings name={user.name} email={user.email} />;
}
