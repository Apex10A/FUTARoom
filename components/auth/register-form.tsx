"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { RolePicker } from "@/components/auth/role-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getAuthErrorMessage,
  getDashboardPathForRole,
} from "@/lib/auth/helpers";
import type { ProfileRole } from "@/lib/auth/helpers";
import { type UserRole } from "@/lib/constants/auth";
import { createClient } from "@/lib/supabase/client";
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
  const router = useRouter();
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
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof RegisterFormData>(
    key: K,
    value: RegisterFormData[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setAuthError(null);
    setSuccessMessage(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRegister(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);
    setSuccessMessage(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          full_name: form.fullName.trim(),
          phone: form.phone.trim(),
          role: form.role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setAuthError(getAuthErrorMessage(error.message));
      setIsSubmitting(false);
      return;
    }

    if (data.session) {
      router.push(getDashboardPathForRole(form.role as ProfileRole));
      router.refresh();
      return;
    }

    setSuccessMessage(
      "Account created. Check your email to confirm your address, then sign in."
    );
    setIsSubmitting(false);
  }

  return (
    <AuthShell
      title="Create your account"
      description="Join as a student or property owner. It only takes a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#E8B84A] underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
          <FieldError message={errors.confirmPassword} />
        </div>

        {authError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {authError}
          </div>
        )}

        {successMessage && (
          <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
            {successMessage}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
