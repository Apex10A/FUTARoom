import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your FUTARoom account.",
};

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectParam = params.redirect;
  const redirectTo =
    typeof redirectParam === "string" ? redirectParam : undefined;

  return <LoginForm redirectTo={redirectTo} />;
}
