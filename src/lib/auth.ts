import { supabase } from "@/lib/supabase";

export type Contact = { method: "email" | "phone"; email?: string; phone?: string };

/** Normalised E.164-ish phone: dial code + digits. */
export function fullPhone(dial: string, phone: string) {
  return `${dial}${phone.replace(/\D/g, "")}`.replace(/[^\d+]/g, "");
}

function friendly(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid") && m.includes("token")) return "That code isn't right. Check the six digits and try again.";
  if (m.includes("expired")) return "This code has expired. Request a new one below.";
  if (m.includes("rate") || m.includes("seconds")) return "Too many attempts — please wait a moment and try again.";
  if (m.includes("invalid login credentials")) return "Those details don't match an account.";
  if (m.includes("user already registered")) return "An account already uses these details. Try signing in instead.";
  return message;
}

export function authError(error: { message: string } | null | undefined) {
  return error ? friendly(error.message) : null;
}

/** Sends a 6-digit OTP for signup (creates the user if needed). */
export async function sendSignupCode(c: Contact) {
  const { error } =
    c.method === "email"
      ? await supabase.auth.signInWithOtp({
          email: c.email!.trim(),
          options: { shouldCreateUser: true },
        })
      : await supabase.auth.signInWithOtp({ phone: c.phone!, options: { shouldCreateUser: true } });
  return authError(error);
}

export async function verifySignupCode(c: Contact, token: string) {
  const { error } =
    c.method === "email"
      ? await supabase.auth.verifyOtp({ email: c.email!.trim(), token, type: "email" })
      : await supabase.auth.verifyOtp({ phone: c.phone!, token, type: "sms" });
  return authError(error);
}

/** Recovery: email uses the password-reset OTP, phone uses an SMS OTP. */
export async function sendRecoveryCode(c: Contact) {
  const { error } =
    c.method === "email"
      ? await supabase.auth.resetPasswordForEmail(c.email!.trim())
      : await supabase.auth.signInWithOtp({ phone: c.phone!, options: { shouldCreateUser: false } });
  return authError(error);
}

export async function verifyRecoveryCode(c: Contact, token: string) {
  const { error } =
    c.method === "email"
      ? await supabase.auth.verifyOtp({ email: c.email!.trim(), token, type: "recovery" })
      : await supabase.auth.verifyOtp({ phone: c.phone!, token, type: "sms" });
  return authError(error);
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  return authError(error);
}

export async function signInWithIdentifier(identifier: string, password: string) {
  const id = identifier.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(id);
  const { error } = isEmail
    ? await supabase.auth.signInWithPassword({ email: id, password })
    : await supabase.auth.signInWithPassword({
        phone: id.startsWith("+") ? id.replace(/[^\d+]/g, "") : `+${id.replace(/\D/g, "")}`,
        password,
      });
  return authError(error);
}

/** true when the handle is free. */
export async function isUsernameAvailable(username: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .maybeSingle();
  if (error) throw error;
  return !data;
}

export type ProfileInput = {
  username: string;
  full_name: string;
  birthday: string | null;
  gender: string | null;
  bio?: string;
  location?: string;
  interests?: string[];
  avatar_url?: string | null;
};

export async function saveProfile(input: ProfileInput) {
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
  if (!user) return "Your session expired. Please start again.";
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, ...input, updated_at: new Date().toISOString() }, { onConflict: "id" });
  return authError(error);
}
