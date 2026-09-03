import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "socialx.session";

export type SessionUser = { username: string; fullName: string };

type SessionState =
  | { status: "loading"; user: null }
  | { status: "signed-out"; user: null }
  | { status: "signed-in"; user: SessionUser };

type Ctx = SessionState & {
  signIn: (user: SessionUser) => void;
  signOut: () => void;
};

const SessionContext = createContext<Ctx | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ status: "loading", user: null });

  // Read the persisted session after hydration so the server and the first
  // client render agree, then settle into signed-in / signed-out.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as SessionUser) : null;
      if (parsed?.username) {
        setState({ status: "signed-in", user: parsed });
        return;
      }
    } catch {
      /* corrupted value — treat as signed out */
    }
    setState({ status: "signed-out", user: null });
  }, []);

  const signIn = useCallback((user: SessionUser) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      /* storage unavailable — session stays in memory */
    }
    setState({ status: "signed-in", user });
  }, []);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setState({ status: "signed-out", user: null });
  }, []);

  const value = useMemo<Ctx>(() => ({ ...state, signIn, signOut }), [state, signIn, signOut]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}

/** Routes reachable without a session. */
export const PUBLIC_PATHS = ["/welcome", "/signin", "/signup", "/recover"];

export function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
