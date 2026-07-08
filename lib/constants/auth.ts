export const USER_ROLES = [
  {
    id: "student",
    label: "Student",
    description: "Search and save lodges around FUTA.",
  },
  {
    id: "owner",
    label: "Property owner",
    description: "List and manage your hostel or lodge.",
  },
] as const;

export type UserRole = (typeof USER_ROLES)[number]["id"];

export function isUserRole(value: string): value is UserRole {
  return USER_ROLES.some((role) => role.id === value);
}

export function getRoleLabel(role: UserRole): string {
  return USER_ROLES.find((item) => item.id === role)?.label ?? role;
}

export function resolveRegisterRole(roleParam?: string): UserRole {
  if (roleParam && isUserRole(roleParam)) {
    return roleParam;
  }
  return "student";
}
