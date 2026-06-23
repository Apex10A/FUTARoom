import type { StudentProfile } from "@/lib/types/student-profile";

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  fullName: "Afolabi Praise Oluwafemi",
  email: "praise.afolabi@student.futa.edu.ng",
  phone: "08012345678",
  department: "Computer Science",
  level: "400 Level",
};

export const DEPARTMENT_OPTIONS = [
  "Computer Science",
  "Software Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Architecture",
  "Other",
] as const;

export const LEVEL_OPTIONS = [
  "100 Level",
  "200 Level",
  "300 Level",
  "400 Level",
  "500 Level",
  "Postgraduate",
] as const;
