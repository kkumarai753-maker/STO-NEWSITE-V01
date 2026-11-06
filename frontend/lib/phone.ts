import { getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";

export type { CountryCode };
const names = new Intl.DisplayNames(["en"], { type: "region" });
export const phoneCountries = getCountries().map((code) => ({
  code,
  name: names.of(code) || code,
  callingCode: getCountryCallingCode(code),
})).sort((a, b) => a.name.localeCompare(b.name, "en"));

/** Parse national or pasted international input without dropping any digits. */
export function normalizePhone(value: string, country: CountryCode = "IN"): string | null {
  if (!value.trim()) return "";
  if (!/^[+\d\s().-]+$/.test(value)) return null;
  const parsed = parsePhoneNumberFromString(value, country);
  return parsed?.isValid() && !parsed.ext ? parsed.number : null;
}

/** Keep invalid partial input invalid so form validation can report it. */
export function phoneFormValue(value: string, country: CountryCode): string {
  const normalized = normalizePhone(value, country);
  return normalized ?? (value.trim().startsWith("+") ? value.trim() : `+${getCountryCallingCode(country)} ${value}`);
}

export function isContactPhone(value: string): boolean {
  // Accept old ten-digit clients while all new forms submit canonical E.164.
  return value === "" || /^\d{10}$/.test(value) || (/^\+[1-9]\d{6,14}$/.test(value) && normalizePhone(value) === value);
}
