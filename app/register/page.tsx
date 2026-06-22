import type { Metadata } from "next";

import {
  RegisterForm,
  resolveRegisterRole,
} from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a FUTARoom account as a student or property owner.",
};

type RegisterPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const roleParam =
    typeof params.role === "string" ? params.role : undefined;
  const defaultRole = resolveRegisterRole(roleParam);

  return <RegisterForm defaultRole={defaultRole} />;
}
