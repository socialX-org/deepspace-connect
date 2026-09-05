import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

export type SessionUser = {
  id: string;
  username: string;
  fullName: string;
  /** false while the signup flow still has required profile fields to collect. */
  profileComplete: boolean;
};

type SessionState =
  | { status: "loading"; user: null }
  | { status: "signed-out"; user: null }
  | { status: "signed-in"; user: SessionUser };

type Ctx = SessionState & {
  /** Re-read the Supabase session + profile (call after completing signup). */
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<Ctx | null>(null);

async function loadUser(): Promise<SessionUser | null> {
  const { data } = await supabase.auth.getSession();
  const authUser = data.session?.user;
  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, birthday, gender")
    .eq("id", authUser.id)
    .maybeSingle();

  const fallback =
    (authUser.email?.split("@")[0] ?? "") ||
    `sx${(authUser.phone ?? "").slice(-4)}` ||
    "you";

  const profileComplete = Boolean(
    profile?.full_name?.trim() &&
      profile?.birthday &&
      profile?.gender?.trim() &&
      profile?.username?.trim(),
  );

  return {
    id: authUser.id,
    username: profile?.username ?? fallback,
    fullName: profile?.full_name || profile?.username || fallback,
    profileComplete,
  };
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ status: "loading", user: null });
  const mounted = useRef(true);

  const apply = useCallback(async () => {
    const user = await loadUser();
    if (!mounted.current) return;
    setState(user ? { status: "signed-in", user } : { status: "signed-out", user: null });
  }, []);

  useEffect(() => {
    mounted.current = true;
    void apply();

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "TOKEN_REFRESHED") return;
      void apply();
    });

    return () => {
      mounted.current = false;
      sub.subscription.unsubscribe();
    };
  }, [apply]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ status: "signed-out", user: null });
  }, []);

  const value = useMemo<Ctx>(() => ({ ...state, refresh: apply, signOut }), [state, apply, signOut]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}

/** Routes reachable without a session. */
export const PUBLIC_PATHS = ["/welcome", "/signin", "/signup", "/recover"];

/** Auth screens a signed-in user should be bounced away from. The signup and
 *  recovery flows stay reachable: the user is already authenticated mid-flow. */
export const ENTRY_PATHS = ["/welcome", "/signin"];

export function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function isEntryPath(pathname: string) {
  return ENTRY_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
