import type { UserRole } from "@/lib/constants/auth";

export type ProfileRole = UserRole | "admin";

export function getDashboardPathForRole(role: ProfileRole): string {
  switch (role) {
    case "owner":
      return "/dashboard/owner";
    case "admin":
      return "/dashboard/admin";
    case "student":
    default:
      return "/dashboard/student";
  }
}

export function getAuthErrorMessage(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Incorrect email or password. Please try again.";
  }

  if (normalized.includes("user already registered")) {
    return "An account with this email already exists. Sign in instead.";
  }

  if (normalized.includes("password")) {
    return "Password does not meet Supabase security requirements.";
  }

  return message;
}

export function getRequiredDashboardRole(pathname: string): ProfileRole | null {
  if (pathname.startsWith("/dashboard/owner")) return "owner";
  if (pathname.startsWith("/dashboard/admin")) return "admin";
  if (pathname.startsWith("/dashboard/student")) return "student";
  return null;
}

export function isSafeRedirectPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes(":");
}
