import {
  Building2,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";

type AdminStatsProps = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  owners: number;
};

export function AdminStats({
  total,
  pending,
  approved,
  rejected,
  owners,
}: AdminStatsProps) {
  const items = [
    { label: "Total listings", value: total, icon: Building2 },
    { label: "Pending review", value: pending, icon: Clock3 },
    { label: "Approved", value: approved, icon: CheckCircle2 },
    { label: "Rejected", value: rejected, icon: XCircle },
    { label: "Active owners", value: owners, icon: Users },
    {
      label: "Verified rate",
      value: total > 0 ? `${Math.round((approved / total) * 100)}%` : "0%",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <item.icon className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
