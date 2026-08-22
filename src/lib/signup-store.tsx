import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type SignupData = {
  method: "email" | "phone";
  email: string;
  dial: string;
  phone: string;
  fullName: string;
  password: string;
  birthday: { d: number; m: number; y: number } | null;
  gender: string;
  username: string;
  photo: string | null;
  bio: string;
  location: string;
  interests: string[];
  following: string[];
};

const initial: SignupData = {
  method: "email",
  email: "",
  dial: "+234",
  phone: "",
  fullName: "",
  password: "",
  birthday: null,
  gender: "",
  username: "",
  photo: null,
  bio: "",
  location: "",
  interests: [],
  following: [],
};

type Ctx = { data: SignupData; set: (patch: Partial<SignupData>) => void };

const SignupContext = createContext<Ctx | null>(null);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SignupData>(initial);
  const value = useMemo<Ctx>(
    () => ({ data, set: (patch) => setData((d) => ({ ...d, ...patch })) }),
    [data],
  );
  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useSignup() {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error("useSignup must be used inside SignupProvider");
  return ctx;
}

/** muha•••@gmail.com  /  +234 ••• ••• 1234 */
export function maskDestination(d: SignupData) {
  if (d.method === "email") {
    const [name = "", domain = ""] = d.email.split("@");
    const head = name.slice(0, 4) || name;
    return `${head}•••@${domain}`;
  }
  const digits = d.phone.replace(/\D/g, "");
  return `${d.dial} ••• ••• ${digits.slice(-4) || "0000"}`;
}
