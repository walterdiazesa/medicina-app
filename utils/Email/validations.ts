import { EXCLUDED_EMAIL_DOMAINS, REGEX_EMAIL } from "./constants";

export const isValidEmail = (email: string) =>
  !(
    !REGEX_EMAIL.test(String(email).toLowerCase()) ||
    (!["outlook.com", "gmail.com"].some((ext) => email.endsWith(ext)) &&
      EXCLUDED_EMAIL_DOMAINS.some((ext) => email.endsWith(ext)))
  );
