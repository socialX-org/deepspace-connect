import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { PrimaryButton } from "@/components/auth/controls";
import { sendRecoveryCode, verifyRecoveryCode, type Contact } from "@/lib/auth";
import { maskIdentifier, useRecovery } from "@/lib/recovery-store";

export const Route = createFileRoute("/recover/code")({
  component: RecoveryCode,
  head: () => ({
    meta: [
      { title: "Enter recovery code — SocialX" },
      {
        name: "description",
        content: "Enter the six-digit recovery code sent to your email address or mobile number.",
      },
      { property: "og:title", content: "Enter recovery code — SocialX" },
      { property: "og:description", content: "Confirm the six-digit SocialX recovery code." },
    ],
  }),
});

function RecoveryCode() {
  const navigate = useNavigate();
  const { data, set } = useRecovery();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [status, setStatus] = useState<"idle" | "checking" | "error" | "expired" | "done">("idle");
  const [seconds, setSeconds] = useState(42);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const code = digits.join("");

  const contact: Contact =
    data.method === "email"
      ? { method: "email", email: data.identifier }
      : { method: "phone", phone: data.identifier };

  // Guard: no matched account means the flow was skipped.
  useEffect(() => {
    if (!data.username) navigate({ to: "/recover", replace: true });
  }, [data.username, navigate]);

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
    const err = await verifyRecoveryCode(contact, value);
    if (!err) {
      setStatus("done");
      setMessage(null);
      set({ verified: true });
      setTimeout(() => navigate({ to: "/recover/password" }), 650);
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
    const err = await sendRecoveryCode(contact);
    setResending(false);
    if (err) {
      setMessage(err);
      setStatus("error");
      return;
    }
    setSeconds(42);
    setDigits(Array(6).fill(""));
    setMessage(null);
    setStatus("idle");
    refs.current[0]?.focus();
  };

  const invalid = status === "error" || status === "expired";

  return (
    <AuthShell
      title="Enter recovery code"
      description={`We sent a six-digit recovery code to ${maskIdentifier(data.identifier, data.method)}. Enter it below to confirm this account is yours.`}
      onBack={() => navigate({ to: "/recover" })}
      footer={
        <>
          <PrimaryButton
            onClick={() => void verify(code)}
            loading={status === "checking"}
            disabled={code.length < 6 || status === "done"}
          >
            {status === "done" ? "Verified" : status === "checking" ? "Checking code" : "Verify"}
          </PrimaryButton>
          <button
            type="button"
            onClick={() => navigate({ to: "/recover" })}
            className="mt-4 w-full text-center text-[13px] text-[oklch(1_0_0_/_50%)] active:text-foreground"
          >
            Use a different {data.method === "email" ? "email address" : "mobile number"}
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
        {(status === "error" || status === "expired") && (
          <p className="reply-in text-[oklch(0.62_0.2_25)]">
            {message ?? "That recovery code isn't right. Check the six digits and try again."}
          </p>
        )}
        {status === "done" && (
          <p className="reply-in flex items-center gap-2 text-foreground">
            <Check className="size-4" strokeWidth={2.2} /> Verified — let's reset your password
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
            <span className="tabular-nums text-foreground">
              0:{String(seconds).padStart(2, "0")}
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={() => void resend()}
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
