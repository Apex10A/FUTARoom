import { Building2, CheckCircle2, Clock3, XCircle } from "lucide-react";

type OwnerListingStatsProps = {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
};

export function OwnerListingStats({
  total,
  approved,
  pending,
  rejected,
}: OwnerListingStatsProps) {
  const items = [
    {
      label: "Total listings",
      value: total,
      icon: Building2,
    },
    {
      label: "Approved",
      value: approved,
      icon: CheckCircle2,
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
