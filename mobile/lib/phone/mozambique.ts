export const COUNTRY_CODE = "+258";
export const VALID_PREFIXES = ["82", "83", "84", "85", "86", "87", "88"] as const;

const MOZ_PHONE_REGEX = /^\+258(82|83|84|85|86|87|88)\d{7}$/;

export function stripPhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Digits after country code (9 digits: 2 prefix + 7 subscriber). */
export function extractMozLocalDigits(value: string): string {
  let digits = stripPhoneDigits(value);
  if (digits.startsWith("258")) {
    digits = digits.slice(3);
  }
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 9);
}

export function formatMozPhoneDisplay(localDigits: string): string {
  const d = localDigits.slice(0, 9);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
  return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
}

export function normalizeMozPhone(input: string): string {
  const local = extractMozLocalDigits(input);
  if (local.length !== 9) {
    return `${COUNTRY_CODE}${local}`;
  }
  return `${COUNTRY_CODE}${local}`;
}

export function isValidMozPhone(value: string): boolean {
  return MOZ_PHONE_REGEX.test(normalizeMozPhone(value));
}

export function parseStoredPhoneToLocal(phone?: string): string {
  if (!phone) return "";
  return extractMozLocalDigits(phone);
}
