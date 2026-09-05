import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { PrimaryButton } from "@/components/auth/controls";
import { pendingSignupEmail, sendSignupLink } from "@/lib/auth";
import { useSignup } from "@/lib/signup-store";

export const Route = createFileRoute("/signup/check-email")({
  component: CheckEmailStep,
  head: () => ({
    meta: [
      { title: "Check your email — SocialX" },
      {
        name: "description",
        content: "We sent a confirmation link to your inbox. Click it to continue creating your SocialX account.",
      },
      { property: "og:title", content: "Check your email — SocialX" },
      { property: "og:description", content: "Confirm your email address to continue on SocialX." },
    ],
  }),
});

function CheckEmailStep() {
  const navigate = useNavigate();
  const { data } = useSignup();
  const [email, setEmail] = useState(data.email);
  const [seconds, setSeconds] = useState(38);
  const [resending, setResending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) setEmail(pendingSignupEmail() ?? "");
  }, [email]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const resend = async () => {
    if (!email) return;
    setResending(true);
    setError(null);
    const err = await sendSignupLink(email);
    setResending(false);
    if (err) {
      setError(err);
      return;
    }
    setSent(true);
    setSeconds(38);
  };

  return (
    <AuthShell
      step={2}
      eyebrow="Step 2 of 9"
      title="Check your email"
      description={`We sent a confirmation link to ${email || "your email address"}. Please check your inbox and click the link to continue creating your account.`}
      onBack={() => navigate({ to: "/signup" })}
      footer={
        <>
          <PrimaryButton
            onClick={() => void resend()}
            loading={resending}
            disabled={seconds > 0 || resending}
          >
            {seconds > 0 ? `Resend email in 0:${String(seconds).padStart(2, "0")}` : "Resend email"}
          </PrimaryButton>
          <button
            type="button"
            onClick={() => navigate({ to: "/signup" })}
            className="mt-4 w-full text-center text-[13px] text-[oklch(1_0_0_/_50%)] active:text-foreground"
          >
            Use a different email address
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4 rounded-2xl border border-[oklch(1_0_0_/_14%)] p-5">
        <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-[oklch(1_0_0_/_16%)]">
          <Mail className="size-[18px]" strokeWidth={1.6} />
        </span>
        <div>
          <p className="text-[14px] font-semibold">Waiting for confirmation</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[oklch(1_0_0_/_55%)]">
            Open the link on this device and you'll come straight back to finish setting up your
            profile. The link expires after a while — resend it if it stops working.
          </p>
        </div>
      </div>

      <div className="mt-5 min-h-[22px] text-[13px]">
        {error && <p className="reply-in text-[oklch(0.62_0.2_25)]">{error}</p>}
        {!error && sent && (
          <p className="reply-in flex items-center gap-2 text-foreground">
            <Check className="size-4" strokeWidth={2.2} /> New confirmation link sent
          </p>
        )}
        {resending && !sent && (
          <p className="flex items-center gap-2 text-[oklch(1_0_0_/_55%)]">
            <Loader2 className="size-3.5 animate-spin" /> Sending
          </p>
        )}
      </div>

      <p className="mt-8 border-t border-[oklch(1_0_0_/_8%)] pt-6 text-[12.5px] text-[oklch(1_0_0_/_38%)]">
        Can't find it? Check your spam or promotions folder — the message comes from SocialX.
      </p>
    </AuthShell>
  );
}
