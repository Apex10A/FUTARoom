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
  readStudentProfile,
  writeStudentProfile,
} from "@/lib/favorites/storage";
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

  useEffect(() => {
    setForm(readStudentProfile(DEFAULT_STUDENT_PROFILE));
    setReady(true);
  }, []);

  function updateField<K extends keyof StudentProfile>(
    key: K,
    value: StudentProfile[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSaved(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateStudentProfile(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    writeStudentProfile(form);
    setSaved(true);
  }

  if (!ready) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Loading profile...
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
                onChange={(e) => updateField("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
              />
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
              />
              <FieldError message={errors.phone} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="student-department">Department</Label>
              <Select
                value={form.department}
                onValueChange={(value) =>
                  updateField("department", value ?? "")
                }
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
                value={form.level}
                onValueChange={(value) => updateField("level", value ?? "")}
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
              Profile saved on this device. Account sync will be added with
              authentication.
            </div>
          )}

          <Button type="submit" className="w-full sm:w-auto">
            Save profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
