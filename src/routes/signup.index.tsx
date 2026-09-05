import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, PrimaryButton } from "@/components/auth/controls";
import { sendSignupLink } from "@/lib/auth";
import { useSignup } from "@/lib/signup-store";

export const Route = createFileRoute("/signup/")({
  component: ContactStep,
  head: () => ({
    meta: [
      { title: "Create your SocialX account" },
      {
        name: "description",
        content: "Sign up for SocialX with your email address and confirm it in one tap.",
      },
      { property: "og:title", content: "Create your SocialX account" },
      { property: "og:description", content: "Sign up with your email address." },
    ],
  }),
});

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim());

function ContactStep() {
  const navigate = useNavigate();
  const { data, set } = useSignup();
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const valid = emailOk(data.email);
  const error = touched && data.email && !valid ? "That email address doesn't look right." : null;

  const submit = async () => {
    setTouched(true);
    if (!valid || loading) return;
    setSendError(null);
    setLoading(true);
    const err = await sendSignupLink(data.email);
    if (err) {
      setLoading(false);
      setSendError(err);
      return;
    }
    navigate({ to: "/signup/check-email" });
  };

  return (
    <AuthShell
      step={1}
      eyebrow="Step 1 of 9"
      title="What's your email address?"
      description="We'll send you a confirmation link so we know it's really you. Your address stays private."
      onBack={() => navigate({ to: "/welcome" })}
      footer={
        <>
          <PrimaryButton onClick={() => void submit()} loading={loading} disabled={!valid}>
            {loading ? "Sending link" : "Continue"}
          </PrimaryButton>
          {sendError && (
            <p className="reply-in pt-3 text-center text-[13px] text-[oklch(0.62_0.2_25)]">
              {sendError}
            </p>
          )}
          <p className="pt-4 text-center text-[13px] text-[oklch(1_0_0_/_50%)]">
            Already have an account?{" "}
            <span className="font-semibold text-foreground">Log in</span>
          </p>
        </>
      }
    >
      <Field
        label="Email address"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        value={data.email}
        error={error}
        hint="You can use this to log in later."
        onChange={(e) => set({ email: e.target.value })}
        onBlur={() => setTouched(true)}
        onKeyDown={(e) => e.key === "Enter" && void submit()}
      />
    </AuthShell>
  );
}
