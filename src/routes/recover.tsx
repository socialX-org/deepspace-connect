import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { RecoveryProvider } from "@/lib/recovery-store";

export const Route = createFileRoute("/recover")({
  component: RecoverLayout,
});

function RecoverLayout() {
  useEffect(() => {
    document.body.setAttribute("data-auth-open", "");
    return () => document.body.removeAttribute("data-auth-open");
  }, []);

  return (
    <RecoveryProvider>
      <Outlet />
    </RecoveryProvider>
  );
}
