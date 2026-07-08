import {
  getDashboardPathForRole,
  type ProfileRole,
} from "@/lib/auth/helpers";
import { createClient } from "@/lib/supabase/server";

export type AuthSession = {
  userId: string;
  email: string;
  fullName: string;
  role: ProfileRole;
  dashboardPath: string;
};

export async function getAuthSession(): Promise<AuthSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return null;
  }

  const role = profile.role as ProfileRole;

  return {
    userId: user.id,
    email: user.email ?? "",
    fullName: profile.full_name || user.email?.split("@")[0] || "Account",
    role,
    dashboardPath: getDashboardPathForRole(role),
  };
}
