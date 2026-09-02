import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type RecoveryMethod = "email" | "phone";

export type RecoveryState = {
  /** Raw value the user typed on "Find your account". */
  identifier: string;
  method: RecoveryMethod;
  /** Handle of the account we matched — the only account this flow may touch. */
  username: string;
  fullName: string;
  /** True only after the 6-digit code was accepted. */
  verified: boolean;
};

const initial: RecoveryState = {
  identifier: "",
  method: "email",
  username: "",
  fullName: "",
  verified: false,
};

type Ctx = { data: RecoveryState; set: (patch: Partial<RecoveryState>) => void; reset: () => void };

const RecoveryContext = createContext<Ctx | null>(null);

export function RecoveryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RecoveryState>(initial);
  const value = useMemo<Ctx>(
    () => ({
      data,
      set: (patch) => setData((d) => ({ ...d, ...patch })),
      reset: () => setData(initial),
    }),
    [data],
  );
  return <RecoveryContext.Provider value={value}>{children}</RecoveryContext.Provider>;
}

export function useRecovery() {
  const ctx = useContext(RecoveryContext);
  if (!ctx) throw new Error("useRecovery must be used inside RecoveryProvider");
  return ctx;
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim());
export const isPhone = (v: string) => /^\+?[\d\s-]{7,17}$/.test(v.trim());

/** mu•••@gmail.com  /  +234 ••• ••• 1234 */
export function maskIdentifier(value: string, method: RecoveryMethod) {
  if (method === "email") {
    const [name = "", domain = ""] = value.trim().split("@");
    return `${name.slice(0, 2)}•••@${domain}`;
  }
  const digits = value.replace(/\D/g, "");
  return `••• ••• ${digits.slice(-4) || "0000"}`;
}

/** Password rules shared with the Create account flow. */
export function passwordRules(p: string) {
  return [
    { label: "At least 8 characters", ok: p.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(p) },
    { label: "One number or symbol", ok: /[\d\W_]/.test(p) },
  ];
}
