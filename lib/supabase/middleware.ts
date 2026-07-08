import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  getDashboardPathForRole,
  getRequiredDashboardRole,
  type ProfileRole,
} from "@/lib/auth/helpers";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  let profileRole: ProfileRole | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    profileRole = (profile?.role as ProfileRole | undefined) ?? "student";
  }

  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const requiredRole = getRequiredDashboardRole(pathname);
    if (requiredRole && profileRole !== requiredRole) {
      const url = request.nextUrl.clone();
      url.pathname = getDashboardPathForRole(profileRole ?? "student");
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  if (
    (pathname === "/login" || pathname.startsWith("/register")) &&
    user &&
    profileRole
  ) {
    const url = request.nextUrl.clone();
    url.pathname = getDashboardPathForRole(profileRole);
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
