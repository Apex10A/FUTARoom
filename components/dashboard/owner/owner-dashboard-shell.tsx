import Link from "next/link";
import { Building2, LayoutDashboard, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const OWNER_NAV = [
  {
    href: "/dashboard/owner",
    label: "My listings",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/dashboard/owner/listings/new",
    label: "Add listing",
    icon: PlusCircle,
    exact: false,
  },
] as const;

type OwnerDashboardShellProps = {
  children: React.ReactNode;
  currentPath: string;
};

export function OwnerDashboardShell({
  children,
  currentPath,
}: OwnerDashboardShellProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="size-4" />
            Owner dashboard
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            Manage your properties
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            List lodges, track approval status, and keep details up to date.
          </p>
        </div>
        <Button render={<Link href="/dashboard/owner/listings/new" />}>
          <PlusCircle className="size-4" />
          Add listing
        </Button>
      </div>

      <nav className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {OWNER_NAV.map((item) => {
          const active = item.exact
            ? currentPath === item.href
            : currentPath.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
