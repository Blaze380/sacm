export type PasswordRuleStatus = "valid" | "invalid";

export type PasswordRuleKey = "minLength" | "hasLowercase" | "hasUppercase";

export type PasswordRulesStatus = Record<PasswordRuleKey, PasswordRuleStatus>;

const RULES: { key: PasswordRuleKey; test: (password: string) => boolean }[] = [
  { key: "minLength", test: (p) => p.length >= 8 },
  { key: "hasLowercase", test: (p) => /[a-z]/.test(p) },
  { key: "hasUppercase", test: (p) => /[A-Z]/.test(p) },
];

export function getPasswordRuleStatus(password: string): PasswordRulesStatus {
  return RULES.reduce(
    (acc, { key, test }) => {
      acc[key] = test(password) ? "valid" : "invalid";
      return acc;
    },
    {} as PasswordRulesStatus,
  );
}

export function isPasswordValid(password: string): boolean {
  return Object.values(getPasswordRuleStatus(password)).every(
    (s) => s === "valid",
  );
}
