import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, GhostButton, PrimaryButton } from "@/components/auth/controls";
import { updatePassword } from "@/lib/auth";
import { passwordRules, useRecovery } from "@/lib/recovery-store";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/recover/password")({
  component: UpdatePassword,
  head: () => ({
    meta: [
      { title: "Update your password — SocialX" },
      {
        name: "description",
        content: "Choose a new, strong password to finish recovering your SocialX account.",
      },
      { property: "og:title", content: "Update your password — SocialX" },
      { property: "og:description", content: "Set a new SocialX password and get back in." },
    ],
  }),
});

function UpdatePassword() {
  const navigate = useNavigate();
  const { data } = useRecovery();
  const { refresh } = useSession();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showA, setShowA] = useState(false);
  const [showB, setShowB] = useState(false);
  const [touchedConfirm, setTouchedConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveSheet, setSaveSheet] = useState(false);

  // Guard: the password can only be changed for a verified, matched account.
  useEffect(() => {
    if (!data.username || !data.verified) navigate({ to: "/recover", replace: true });
  }, [data.username, data.verified, navigate]);

  const rules = passwordRules(password);
  const met = rules.filter((r) => r.ok).length;
  const strengthLabel = ["Too short", "Weak", "Good", "Strong"][met] ?? "";
  const matches = confirm.length > 0 && confirm === password;
  const valid = met === rules.length && matches;

  const [saveError, setSaveError] = useState<string | null>(null);

  const finish = () => {
    void (async () => {
      await refresh();
      navigate({ to: "/", replace: true });
    })();
  };

  return (
    <>
      <AuthShell
        title="Update your password"
        description={`Choose a new password for @${data.username || "your account"}. Make it one you don't use anywhere else.`}
        onBack={() => navigate({ to: "/recover/code" })}
        footer={
          <PrimaryButton
            disabled={!valid}
            loading={loading}
            onClick={() => {
              if (!valid) return;
              void (async () => {
                setLoading(true);
                setSaveError(null);
                const err = await updatePassword(password);
                setLoading(false);
                if (err) {
                  setSaveError(err);
                  return;
                }
                setSaveSheet(true);
              })();
            }}
          >
            Update password
          </PrimaryButton>
        }
        footerNote={saveError}
      >
        <div className="space-y-4">
          <Field
            label="New password"
            type={showA ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            suffix={
              <button
                type="button"
                onClick={() => setShowA((s) => !s)}
                aria-label={showA ? "Hide password" : "Show password"}
                className="ml-2 flex size-10 items-center justify-center rounded-full text-[oklch(1_0_0_/_55%)] active:scale-90"
              >
                {showA ? (
                  <EyeOff className="size-5" strokeWidth={1.6} />
                ) : (
                  <Eye className="size-5" strokeWidth={1.6} />
                )}
              </button>
            }
          />
          <Field
            label="Confirm password"
            type={showB ? "text" : "password"}
            autoComplete="new-password"
            value={confirm}
            onBlur={() => setTouchedConfirm(true)}
            onChange={(e) => setConfirm(e.target.value)}
            error={touchedConfirm && !matches ? "Both passwords must match." : null}
            suffix={
              <button
                type="button"
                onClick={() => setShowB((s) => !s)}
                aria-label={showB ? "Hide password" : "Show password"}
                className="ml-2 flex size-10 items-center justify-center rounded-full text-[oklch(1_0_0_/_55%)] active:scale-90"
              >
                {showB ? (
                  <EyeOff className="size-5" strokeWidth={1.6} />
                ) : (
                  <Eye className="size-5" strokeWidth={1.6} />
                )}
              </button>
            }
          />
        </div>

        <div className="mt-6">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-[3px] flex-1 rounded-full transition-colors duration-300"
                style={{
                  background:
                    i < met
                      ? met === 3
                        ? "oklch(1 0 0)"
                        : "oklch(0.44 0.18 24)"
                      : "oklch(1 0 0 / 12%)",
                }}
              />
            ))}
          </div>
          <p className="mt-2.5 text-[12.5px] text-[oklch(1_0_0_/_50%)]">
            {password
              ? `Password strength — ${strengthLabel}`
              : "Create a password you don't use elsewhere."}
          </p>

          <ul className="mt-4 space-y-2.5">
            {[...rules, { label: "Both passwords match", ok: matches }].map((r) => (
              <li key={r.label} className="flex items-center gap-2.5">
                <span
                  className={`flex size-[18px] items-center justify-center rounded-full border transition-colors duration-200 ${
                    r.ok ? "border-transparent bg-foreground" : "border-[oklch(1_0_0_/_22%)]"
                  }`}
                >
                  {r.ok && <Check className="size-3 text-background" strokeWidth={3} />}
                </span>
                <span
                  className={`text-[13.5px] transition-colors ${
                    r.ok ? "text-foreground" : "text-[oklch(1_0_0_/_50%)]"
                  }`}
                >
                  {r.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </AuthShell>

      {saveSheet && (
        <div className="sheet-fade fixed inset-0 z-[70] flex flex-col justify-end bg-black/70 backdrop-blur-[2px]">
          <div
            role="dialog"
            aria-label="Save your login info"
            className="sheet-rise mx-auto w-full max-w-md rounded-t-3xl border-t border-[oklch(1_0_0_/_10%)] bg-background px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-3"
          >
            <div className="flex justify-center">
              <span className="h-1 w-9 rounded-full bg-[oklch(1_0_0_/_18%)]" />
            </div>
            <div
              className="mt-6 flex size-11 items-center justify-center rounded-full"
              style={{ background: "oklch(0.3 0.14 24 / 45%)" }}
            >
              <ShieldCheck className="size-5" strokeWidth={1.7} />
            </div>
            <h2 className="font-display mt-4 text-[22px] font-semibold tracking-[-0.02em]">
              Save your login info?
            </h2>
            <p className="mt-2.5 text-[14px] leading-relaxed text-[oklch(1_0_0_/_58%)]">
              We'll remember @{data.username} on this device so you can sign in with one tap next
              time.
            </p>
            <div className="mt-7 space-y-3">
              <PrimaryButton onClick={finish}>Save login info</PrimaryButton>
              <GhostButton onClick={finish}>Not now</GhostButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
