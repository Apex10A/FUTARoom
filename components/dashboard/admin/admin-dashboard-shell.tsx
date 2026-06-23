import Link from "next/link";
import { Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  {
    href: "/dashboard/admin",
    label: "Moderation queue",
    icon: Shield,
    exact: true,
  },
] as const;

type AdminDashboardShellProps = {
  children: React.ReactNode;
  currentPath: string;
};

export function AdminDashboardShell({
  children,
  currentPath,
}: AdminDashboardShellProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="size-4" />
            Admin dashboard
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            Listing moderation
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review new submissions, approve accurate listings, and keep students
            safe from misleading posts.
          </p>
        </div>
        <Button variant="outline" render={<Link href="/listings" />}>
          View public listings
        </Button>
      </div>

      <nav className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {ADMIN_NAV.map((item) => {
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
