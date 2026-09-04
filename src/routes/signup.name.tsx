import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, PrimaryButton } from "@/components/auth/controls";
import { updatePassword } from "@/lib/auth";
import { useSignup } from "@/lib/signup-store";

export const Route = createFileRoute("/signup/name")({
  component: NameStep,
  head: () => ({
    meta: [
      { title: "Your name & password — SocialX" },
      { name: "description", content: "Add your full name and create a secure SocialX password." },
      { property: "og:title", content: "Your name & password — SocialX" },
      { property: "og:description", content: "Add your name and create a secure password." },
    ],
  }),
});

function NameStep() {
  const navigate = useNavigate();
  const { data, set } = useSignup();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touchedName, setTouchedName] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const p = data.password;
  const rules = [
    { label: "At least 8 characters", ok: p.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(p) },
    { label: "One number or symbol", ok: /[\d\W_]/.test(p) },
  ];
  const met = rules.filter((r) => r.ok).length;
  const nameOk = data.fullName.trim().length >= 2;
  const valid = nameOk && met === rules.length;

  const strengthLabel = ["Too short", "Weak", "Good", "Strong"][met] ?? "";

  return (
    <AuthShell
      step={3}
      eyebrow="Step 3 of 9"
      title="Enter your full name & password"
      description="Your name is how friends recognise you on SocialX. Your password keeps the account yours alone."
      footer={
        <>
          <PrimaryButton
            disabled={!valid}
            loading={loading}
            onClick={() => {
              void (async () => {
                setLoading(true);
                setSaveError(null);
                const err = await updatePassword(data.password);
                setLoading(false);
                if (err) {
                  setSaveError(err);
                  return;
                }
                navigate({ to: "/signup/birthday" });
              })();
            }}
          >
            Continue
          </PrimaryButton>
          {saveError && (
            <p className="reply-in pt-3 text-center text-[13px] text-[oklch(0.62_0.2_25)]">
              {saveError}
            </p>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <Field
          label="Full name"
          autoComplete="name"
          value={data.fullName}
          onChange={(e) => set({ fullName: e.target.value })}
          onBlur={() => setTouchedName(true)}
          error={touchedName && !nameOk ? "Please enter your name as people know it." : null}
        />

        <Field
          label="Password"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          value={data.password}
          onChange={(e) => set({ password: e.target.value })}
          suffix={
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="ml-2 flex size-10 items-center justify-center rounded-full text-[oklch(1_0_0_/_55%)] active:scale-90"
            >
              {show ? <EyeOff className="size-5" strokeWidth={1.6} /> : <Eye className="size-5" strokeWidth={1.6} />}
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
          {p ? `Password strength — ${strengthLabel}` : "Create a password you don't use elsewhere."}
        </p>

        <ul className="mt-4 space-y-2.5">
          {rules.map((r) => (
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
  );
}
