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
      <p className="text-sm font-medium text-white">I am a...</p>
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
                  ? "border-[#E8B84A]/50 bg-[#E8B84A]/10 ring-1 ring-[#E8B84A]/30"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
              )}
            >
              <div
                className={cn(
                  "mb-3 flex size-9 items-center justify-center rounded-lg",
                  selected
                    ? "bg-[#E8B84A]/20 text-[#E8B84A]"
                    : "bg-white/5 text-white/60"
                )}
              >
                <Icon className="size-4" />
              </div>
              <p className="font-medium text-white">{role.label}</p>
              <p className="mt-1 text-xs text-white/55">
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
