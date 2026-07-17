"use client";

import { Building2, GraduationCap } from "lucide-react";

import { USER_ROLES, type UserRole } from "@/lib/constants/auth";
import { cn } from "@/lib/utils";

const ROLE_ICONS = {
  student: GraduationCap,
  owner: Building2,
} as const;

type RolePickerProps = {
  value: UserRole;
  onChange: (role: UserRole) => void;
  error?: string;
};

export function RolePicker({ value, onChange, error }: RolePickerProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">I am a...</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {USER_ROLES.map((role) => {
          const Icon = ROLE_ICONS[role.id];
          const selected = value === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onChange(role.id)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                selected
                  ? "border-primary bg-primary/5 shadow-sm shadow-primary/10 ring-2 ring-primary/15"
                  : "border-border bg-background hover:border-primary/30 hover:bg-muted/40"
              )}
            >
              <div
                className={cn(
                  "mb-3 flex size-9 items-center justify-center rounded-lg",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="size-4" />
              </div>
              <p className="font-medium text-foreground">{role.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {role.description}
              </p>
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
