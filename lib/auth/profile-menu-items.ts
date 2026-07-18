import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Heart,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

import type { ProfileRole } from "@/lib/auth/helpers";

export type ProfileMenuItem =
  | {
      type: "link";
      label: string;
      href: string;
      icon: LucideIcon;
    }
  | {
      type: "action";
      label: string;
      icon: LucideIcon;
      action: "sign-out";
    };

export function getProfileMenuItems(role: ProfileRole): ProfileMenuItem[] {
  const helpItem: ProfileMenuItem = {
    type: "link",
    label: "Help & support",
    href: "/listings",
    icon: HelpCircle,
  };

  switch (role) {
    case "owner":
      return [
        {
          type: "link",
          label: "Account info",
          href: "/dashboard/owner",
          icon: UserCircle,
        },
        {
          type: "link",
          label: "My listings",
          href: "/dashboard/owner",
          icon: Building2,
        },
        {
          type: "link",
          label: "Add listing",
          href: "/dashboard/owner/listings/new",
          icon: LayoutDashboard,
        },
        helpItem,
        {
          type: "action",
          label: "Sign out",
          icon: LogOut,
          action: "sign-out",
        },
      ];
    case "admin":
      return [
        {
          type: "link",
          label: "Moderation",
          href: "/dashboard/admin",
          icon: ShieldCheck,
        },
        helpItem,
        {
          type: "action",
          label: "Sign out",
          icon: LogOut,
          action: "sign-out",
        },
      ];
    case "student":
    default:
      return [
        {
          type: "link",
          label: "Account info",
          href: "/dashboard/student/profile",
          icon: UserCircle,
        },
        {
          type: "link",
          label: "Saved listings",
          href: "/dashboard/student",
          icon: Heart,
        },
        helpItem,
        {
          type: "action",
          label: "Sign out",
          icon: LogOut,
          action: "sign-out",
        },
      ];
  }
}
