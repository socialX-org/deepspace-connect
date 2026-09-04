import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { isEntryPath, isPublicPath, useSession } from "@/lib/session";

/**
 * Blocks every app screen until the Supabase session has been read.
 * Signed-out visitors are sent to /welcome; signed-in visitors never see the
 * welcome / sign-in screens (the signup + recovery flows stay reachable,
 * because the user is authenticated part-way through them).
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const publicPath = isPublicPath(pathname);
  const entryPath = isEntryPath(pathname);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "signed-out" && !publicPath) {
      navigate({ to: "/welcome", replace: true });
    } else if (status === "signed-in" && entryPath) {
      navigate({ to: "/", replace: true });
    }
  }, [status, publicPath, entryPath, navigate]);

  const blocked =
    status === "loading" ||
    (status === "signed-out" && !publicPath) ||
    (status === "signed-in" && entryPath);

  if (blocked) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading SocialX"
        className="flex min-h-[100dvh] items-center justify-center bg-background"
      >
        <span
          className="size-2 animate-pulse rounded-full"
          style={{ background: "oklch(0.44 0.18 24)" }}
        />
      </div>
    );
  }

  return <>{children}</>;
}
