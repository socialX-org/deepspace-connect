import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { SignupProvider } from "@/lib/signup-store";

export const Route = createFileRoute("/signup")({
  component: SignupLayout,
});

function SignupLayout() {
  useEffect(() => {
    document.body.setAttribute("data-auth-open", "");
    return () => document.body.removeAttribute("data-auth-open");
  }, []);

  return (
    <SignupProvider>
      <Outlet />
    </SignupProvider>
  );
}
