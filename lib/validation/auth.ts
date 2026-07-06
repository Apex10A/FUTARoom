export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidNigerianPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return (
    (digits.length === 11 && digits.startsWith("0")) ||
    (digits.length === 13 && digits.startsWith("234"))
  );
}

export function isStrongEnoughPassword(value: string): boolean {
  return value.length >= 8;
}
