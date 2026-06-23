import type { StudentProfile } from "@/lib/types/student-profile";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

export function validateStudentProfile(
  data: StudentProfile
): Partial<Record<keyof StudentProfile, string>> {
  const errors: Partial<Record<keyof StudentProfile, string>> = {};

  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!isValidPhone(data.phone)) {
    errors.phone = "Enter a valid Nigerian phone number.";
  }

  if (!data.department.trim()) {
    errors.department = "Select your department.";
  }

  if (!data.level.trim()) {
    errors.level = "Select your level.";
  }

  return errors;
}
