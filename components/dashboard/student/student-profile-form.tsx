"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DEPARTMENT_OPTIONS,
  DEFAULT_STUDENT_PROFILE,
  LEVEL_OPTIONS,
} from "@/lib/constants/student-profile";
import {
  fetchStudentProfile,
  saveStudentProfile,
} from "@/lib/profile/student-profile";
import type { StudentProfile } from "@/lib/types/student-profile";
import { validateStudentProfile } from "@/lib/validations/student-profile";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export function StudentProfileForm() {
  const [form, setForm] = useState<StudentProfile>(DEFAULT_STUDENT_PROFILE);
  const [errors, setErrors] = useState<
    Partial<Record<keyof StudentProfile, string>>
  >({});
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const result = await fetchStudentProfile();

      if (cancelled) {
        return;
      }

      if (result.error) {
        setLoadError(result.error);
      } else if (result.profile) {
        setForm(result.profile);
      }

      setReady(true);
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField<K extends keyof StudentProfile>(
    key: K,
    value: StudentProfile[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSaved(false);
    setSaveError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateStudentProfile(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const result = await saveStudentProfile(form);

    setIsSaving(false);

    if (result.error) {
      setSaveError(result.error);
      return;
    }

    setSaved(true);
  }

  if (!ready) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center">
        <p className="font-medium text-foreground">Could not load profile</p>
        <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
      </div>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold">Profile settings</CardTitle>
        <CardDescription>
          Keep your details updated so owners know who is contacting them.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="student-name">Full name</Label>
            <Input
              id="student-name"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              aria-invalid={Boolean(errors.fullName)}
              disabled={isSaving}
            />
            <FieldError message={errors.fullName} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="student-email">Email</Label>
              <Input
                id="student-email"
                type="email"
                value={form.email}
                disabled
                aria-invalid={Boolean(errors.email)}
              />
              <p className="text-xs text-muted-foreground">
                Email is tied to your sign-in account.
              </p>
              <FieldError message={errors.email} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="student-phone">Phone</Label>
              <Input
                id="student-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                aria-invalid={Boolean(errors.phone)}
                disabled={isSaving}
              />
              <FieldError message={errors.phone} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="student-department">Department</Label>
              <Select
                value={form.department || undefined}
                onValueChange={(value) =>
                  updateField("department", value ?? "")
                }
                disabled={isSaving}
              >
                <SelectTrigger id="student-department" className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENT_OPTIONS.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.department} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="student-level">Level</Label>
              <Select
                value={form.level || undefined}
                onValueChange={(value) => updateField("level", value ?? "")}
                disabled={isSaving}
              >
                <SelectTrigger id="student-level" className="w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVEL_OPTIONS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.level} />
            </div>
          </div>

          {saved && (
            <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
              Profile saved to your FUTARoom account.
            </div>
          )}

          {saveError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {saveError}
            </div>
          )}

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
