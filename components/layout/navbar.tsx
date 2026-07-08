import { NavbarClient } from "@/components/layout/navbar-client";
import { getAuthSession } from "@/lib/auth/session";

export async function Navbar() {
  const session = await getAuthSession();
  return <NavbarClient session={session} />;
}
