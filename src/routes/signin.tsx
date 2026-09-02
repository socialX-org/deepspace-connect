import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, PrimaryButton } from "@/components/auth/controls";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/signin")({
  component: SignIn,
  head: () => ({
    meta: [
      { title: "Sign in — SocialX" },
      {
        name: "description",
        content: "Sign in to SocialX to return to your feed, stories, Clips and messages.",
      },
      { property: "og:title", content: "Sign in — SocialX" },
      { property: "og:description", content: "Return to your SocialX feed in one quiet step." },
    ],
  }),
});

function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.setAttribute("data-auth-open", "");
    return () => document.body.removeAttribute("data-auth-open");
  }, []);

  const valid = identifier.trim().length >= 3 && password.length >= 6;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || loading) return;
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const handle = identifier.trim().replace(/^@/, "").split("@")[0] ?? "you";
      signIn({ username: handle, fullName: handle });
      navigate({ to: "/", replace: true });
    }, 650);
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in with your username, email or phone number to pick up exactly where you left off."
      onBack={() => navigate({ to: "/welcome" })}
      footer={
        <PrimaryButton onClick={submit} disabled={!valid} loading={loading}>
          Sign in
        </PrimaryButton>
      }
    >
      <form onSubmit={submit} className="space-y-3">
        <Field
          label="Username, email or phone"
          value={identifier}
          autoComplete="username"
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <Field
          label="Password"
          type="password"
          value={password}
          autoComplete="current-password"
          error={error}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setError("Password recovery isn't available yet.")}
          className="pt-1 text-[13px] text-[oklch(1_0_0_/_55%)]"
        >
          Forgot password?
        </button>
      </form>
    </AuthShell>
  );
}
