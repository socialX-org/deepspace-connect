import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { isPublicPath, useSession } from "@/lib/session";

/**
 * Blocks every app screen until the persisted session has been read.
 * Signed-out visitors are sent to /welcome; signed-in visitors never see
 * the auth screens.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const publicPath = isPublicPath(pathname);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "signed-out" && !publicPath) {
      navigate({ to: "/welcome", replace: true });
    } else if (status === "signed-in" && publicPath) {
      navigate({ to: "/", replace: true });
    }
  }, [status, publicPath, navigate]);

  const blocked =
    status === "loading" ||
    (status === "signed-out" && !publicPath) ||
    (status === "signed-in" && publicPath);

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
