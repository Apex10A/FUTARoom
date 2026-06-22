"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { RolePicker } from "@/components/auth/role-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type UserRole, isUserRole } from "@/lib/constants/auth";
import {
  type RegisterFormData,
  validateRegister,
} from "@/lib/validations/auth";

type RegisterFormProps = {
  defaultRole?: UserRole;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export function RegisterForm({ defaultRole = "student" }: RegisterFormProps) {
  const [form, setForm] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: defaultRole,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof RegisterFormData>(
    key: K,
    value: RegisterFormData[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitted(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRegister(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitted(true);
  }

  return (
    <AuthShell
      title="Create your account"
      description="Join FUTARoom to find accommodation or list your property for students."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <RolePicker
          value={form.role}
          onChange={(role) => updateField("role", role)}
          error={errors.role}
        />

        <div className="space-y-1.5">
          <Label htmlFor="register-name">Full name</Label>
          <Input
            id="register-name"
            autoComplete="name"
            placeholder="Afolabi Praise"
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            aria-invalid={Boolean(errors.fullName)}
          />
          <FieldError message={errors.fullName} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
          <FieldError message={errors.email} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="register-phone">Phone number</Label>
          <Input
            id="register-phone"
            type="tel"
            autoComplete="tel"
            placeholder="08012345678"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
          />
          <FieldError message={errors.phone} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            aria-invalid={Boolean(errors.password)}
          />
          <FieldError message={errors.password} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="register-confirm-password">Confirm password</Label>
          <Input
            id="register-confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={(event) =>
              updateField("confirmPassword", event.target.value)
            }
            aria-invalid={Boolean(errors.confirmPassword)}
          />
          <FieldError message={errors.confirmPassword} />
        </div>

        {submitted && (
          <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
            Account UI validated successfully. Real sign-up will be enabled when
            authentication is integrated.
          </div>
        )}

        <Button type="submit" className="w-full" size="lg">
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}

export function resolveRegisterRole(roleParam?: string): UserRole {
  if (roleParam && isUserRole(roleParam)) {
    return roleParam;
  }
  return "student";
}
