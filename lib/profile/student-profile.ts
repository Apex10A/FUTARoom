"use client";

import { createClient } from "@/lib/supabase/client";
import type { StudentProfile } from "@/lib/types/student-profile";

const LEGACY_PROFILE_KEY = "futaroom:student-profile";

type ProfileRow = {
  full_name: string;
  email: string | null;
  phone: string | null;
  department: string | null;
  level: string | null;
};

function readLegacyStudentProfile(): StudentProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(LEGACY_PROFILE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<StudentProfile>;
    return {
      fullName: parsed.fullName ?? "",
      email: parsed.email ?? "",
      phone: parsed.phone ?? "",
      department: parsed.department ?? "",
      level: parsed.level ?? "",
    };
  } catch {
    return null;
  }
}

function clearLegacyStudentProfile() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LEGACY_PROFILE_KEY);
}

function buildProfile(
  row: ProfileRow,
  email: string,
  legacy: StudentProfile | null
): StudentProfile {
  return {
    fullName: row.full_name || legacy?.fullName || "",
    email: row.email || email || legacy?.email || "",
    phone: row.phone || legacy?.phone || "",
    department: row.department || legacy?.department || "",
    level: row.level || legacy?.level || "",
  };
}

function shouldMigrateLegacy(row: ProfileRow, legacy: StudentProfile): boolean {
  return (
    (!row.full_name && Boolean(legacy.fullName)) ||
    (!row.phone && Boolean(legacy.phone)) ||
    (!row.department && Boolean(legacy.department)) ||
    (!row.level && Boolean(legacy.level))
  );
}

export async function fetchStudentProfile(): Promise<{
  profile?: StudentProfile;
  error?: string;
}> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Sign in to manage your profile." };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, email, phone, department, level")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: "Profile not found." };
  }

  const legacy = readLegacyStudentProfile();
  const profile = buildProfile(data, user.email ?? "", legacy);

  if (legacy && shouldMigrateLegacy(data, legacy)) {
    const { error: migrateError } = await supabase
      .from("profiles")
      .update({
        full_name: profile.fullName.trim(),
        phone: profile.phone.trim() || null,
        department: profile.department || null,
        level: profile.level || null,
      })
      .eq("id", user.id);

    if (!migrateError) {
      clearLegacyStudentProfile();
    }
  }

  return { profile };
}

export async function saveStudentProfile(
  form: StudentProfile
): Promise<{ error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Sign in to save your profile." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: form.fullName.trim(),
      phone: form.phone.trim() || null,
      department: form.department || null,
      level: form.level || null,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  clearLegacyStudentProfile();
  return {};
}
