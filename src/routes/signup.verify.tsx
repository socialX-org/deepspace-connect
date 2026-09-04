import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { PrimaryButton } from "@/components/auth/controls";
import { fullPhone, sendSignupCode, verifySignupCode, type Contact } from "@/lib/auth";
import { maskDestination, useSignup } from "@/lib/signup-store";

export const Route = createFileRoute("/signup/verify")({
  component: VerifyStep,
  head: () => ({
    meta: [
      { title: "Confirm your code — SocialX" },
      { name: "description", content: "Enter the six-digit code we sent to verify your SocialX account." },
      { property: "og:title", content: "Confirm your code — SocialX" },
      { property: "og:description", content: "Enter your six-digit SocialX verification code." },
    ],
  }),
});

function VerifyStep() {
  const navigate = useNavigate();
  const { data } = useSignup();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [status, setStatus] = useState<"idle" | "checking" | "error" | "expired" | "done">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(38);
  const [resending, setResending] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const contact: Contact =
    data.method === "email"
      ? { method: "email", email: data.email }
      : { method: "phone", phone: fullPhone(data.dial, data.phone) };

  const code = digits.join("");

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  useEffect(() => {
    if (code.length === 6 && status === "idle") void verify(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const verify = async (value: string) => {
    if (value.length < 6) return;
    setStatus("checking");
    const err = await verifySignupCode(contact, value);
    if (!err) {
      setStatus("done");
      setMessage(null);
      setTimeout(() => navigate({ to: "/signup/name" }), 700);
      return;
    }
    setMessage(err);
    setStatus(err.toLowerCase().includes("expired") ? "expired" : "error");
    if (navigator.vibrate) navigator.vibrate(18);
  };

  const write = (i: number, v: string) => {
    const chars = v.replace(/\D/g, "").split("");
    if (chars.length === 0) return;
    const next = [...digits];
    chars.forEach((c, k) => {
      if (i + k < 6) next[i + k] = c;
    });
    setDigits(next);
    if (status !== "checking") setStatus("idle");
    refs.current[Math.min(i + chars.length, 5)]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (next[i]) next[i] = "";
      else if (i > 0) {
        next[i - 1] = "";
        refs.current[i - 1]?.focus();
      }
      setDigits(next);
      setStatus("idle");
    }
    if (e.key === "ArrowLeft") refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight") refs.current[i + 1]?.focus();
  };

  const resend = async () => {
    setResending(true);
    const err = await sendSignupCode(contact);
    setResending(false);
    if (err) {
      setMessage(err);
      setStatus("error");
      return;
    }
    setSeconds(38);
    setDigits(Array(6).fill(""));
    setMessage(null);
    setStatus("idle");
    refs.current[0]?.focus();
  };

  const invalid = status === "error" || status === "expired";

  return (
    <AuthShell
      step={2}
      eyebrow="Step 2 of 9"
      title="Verify it's you"
      description={`We sent a six-digit code to ${maskDestination(data)}. Enter it below to confirm your account.`}
      footer={
        <>
          <PrimaryButton
            onClick={() => verify(code)}
            loading={status === "checking"}
            disabled={code.length < 6 || status === "done"}
          >
            {status === "done" ? "Verified" : status === "checking" ? "Checking code" : "Confirm"}
          </PrimaryButton>
          <button
            type="button"
            onClick={() => navigate({ to: "/signup" })}
            className="mt-4 w-full text-center text-[13px] text-[oklch(1_0_0_/_50%)] active:text-foreground"
          >
            Change {data.method === "email" ? "email address" : "phone number"}
          </button>
        </>
      }
    >
      <div
        className={`flex justify-between gap-2 ${invalid ? "shake" : ""}`}
        onPaste={(e) => {
          e.preventDefault();
          write(0, e.clipboardData.getData("text"));
        }}
      >
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={d}
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-label={`Digit ${i + 1}`}
            maxLength={6}
            onChange={(e) => write(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            disabled={status === "done"}
            className={`h-[62px] w-full rounded-2xl border bg-background text-center font-display text-[24px] font-semibold tabular-nums outline-none transition-all duration-200 ${
              invalid
                ? "border-[oklch(0.5_0.19_25)] text-[oklch(0.7_0.16_25)]"
                : status === "done"
                  ? "border-[oklch(1_0_0_/_60%)]"
                  : d
                    ? "border-[oklch(1_0_0_/_55%)]"
                    : "border-[oklch(1_0_0_/_16%)]"
            } focus:border-[oklch(1_0_0_/_75%)]`}
          />
        ))}
      </div>

      <div className="mt-5 min-h-[22px] text-[13px]">
        {status === "error" && (
          <p className="reply-in text-[oklch(0.62_0.2_25)]">
            That code isn't right. Check the digits and try again.
          </p>
        )}
        {status === "expired" && (
          <p className="reply-in text-[oklch(0.62_0.2_25)]">
            This code has expired. Request a new one below.
          </p>
        )}
        {status === "done" && (
          <p className="reply-in flex items-center gap-2 text-foreground">
            <Check className="size-4" strokeWidth={2.2} /> Verified — taking you forward
          </p>
        )}
        {status === "checking" && (
          <p className="flex items-center gap-2 text-[oklch(1_0_0_/_55%)]">
            <Loader2 className="size-3.5 animate-spin" /> Checking your code
          </p>
        )}
      </div>

      <div className="mt-8 border-t border-[oklch(1_0_0_/_8%)] pt-6">
        {seconds > 0 && !resending ? (
          <p className="text-[13.5px] text-[oklch(1_0_0_/_45%)]">
            You can request a new code in{" "}
            <span className="tabular-nums text-foreground">0:{String(seconds).padStart(2, "0")}</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={resend}
            disabled={resending}
            className="flex items-center gap-2 text-[13.5px] font-semibold text-foreground active:opacity-70"
          >
            {resending && <Loader2 className="size-3.5 animate-spin" />}
            {resending ? "Sending a new code" : "Resend code"}
          </button>
        )}
        <p className="mt-2 text-[12.5px] text-[oklch(1_0_0_/_38%)]">
          Demo: use 123456 to continue, 000000 to see the expired state.
        </p>
      </div>
    </AuthShell>
  );
}
