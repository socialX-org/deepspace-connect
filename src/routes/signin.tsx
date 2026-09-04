import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, GhostButton, PrimaryButton } from "@/components/auth/controls";
import { signInWithIdentifier } from "@/lib/auth";
import { isEmail, isPhone } from "@/lib/recovery-store";
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
  const { refresh } = useSession();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idError, setIdError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.setAttribute("data-auth-open", "");
    return () => document.body.removeAttribute("data-auth-open");
  }, []);

  const idValid = isEmail(identifier) || isPhone(identifier);
  const valid = idValid && password.length >= 6;

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (loading) return;
    if (!idValid) {
      setIdError("Enter the email address or mobile number on your account.");
      return;
    }
    if (password.length < 6) {
      setError("Your password must be at least 6 characters.");
      return;
    }
    setError(null);
    setIdError(null);
    setLoading(true);
    const err = await signInWithIdentifier(identifier, password);
    if (err) {
      setLoading(false);
      setError(err);
      return;
    }
    await refresh();
    navigate({ to: "/", replace: true });
  };

  return (
    <AuthShell
      eyebrow="SocialX"
      title="Welcome back"
      description="Sign in with the email address or mobile number on your account to pick up exactly where you left off."
      onBack={() => navigate({ to: "/welcome" })}
      footer={
        <>
          <PrimaryButton onClick={() => submit()} disabled={!valid} loading={loading}>
            Sign in
          </PrimaryButton>
          <div className="mt-3">
            <GhostButton type="button" onClick={() => navigate({ to: "/recover" })}>
              Forgot password
            </GhostButton>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/signup" })}
            className="mt-4 w-full text-center text-[13px] text-[oklch(1_0_0_/_50%)] active:text-foreground"
          >
            New here? Create an account
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-3">
        <Field
          label="Email or mobile number"
          value={identifier}
          autoComplete="username"
          inputMode="email"
          error={idError}
          onChange={(e) => {
            setIdentifier(e.target.value);
            setIdError(null);
          }}
        />
        <Field
          label="Password"
          type={show ? "text" : "password"}
          value={password}
          autoComplete="current-password"
          error={error}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          suffix={
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="ml-2 flex size-10 items-center justify-center rounded-full text-[oklch(1_0_0_/_55%)] active:scale-90"
            >
              {show ? (
                <EyeOff className="size-5" strokeWidth={1.6} />
              ) : (
                <Eye className="size-5" strokeWidth={1.6} />
              )}
            </button>
          }
        />
      </form>
    </AuthShell>
  );
}
