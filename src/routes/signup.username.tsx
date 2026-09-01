import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { PrimaryButton } from "@/components/auth/controls";
import { useSignup } from "@/lib/signup-store";

export const Route = createFileRoute("/signup/username")({
  component: UsernameStep,
  head: () => ({
    meta: [
      { title: "Choose your username — SocialX" },
      { name: "description", content: "Pick the username people will use to find you on SocialX." },
      { property: "og:title", content: "Choose your username — SocialX" },
      { property: "og:description", content: "Pick the handle people will know you by." },
    ],
  }),
});

const TAKEN = ["mara.k", "nightform", "orenlab", "juno", "sable", "elias", "socialx"];

type State = "empty" | "invalid" | "checking" | "free" | "taken";

function UsernameStep() {
  const navigate = useNavigate();
  const { data, set } = useSignup();
  const [state, setState] = useState<State>("empty");
  const [loading, setLoading] = useState(false);

  const value = data.username;

  useEffect(() => {
    const v = value.trim().toLowerCase();
    if (!v) return setState("empty");
    if (!/^[a-z0-9._]{3,20}$/.test(v)) return setState("invalid");
    setState("checking");
    const t = setTimeout(() => setState(TAKEN.includes(v) ? "taken" : "free"), 600);
    return () => clearTimeout(t);
  }, [value]);

  const suggestions = value
    ? [`${value}_`, `${value}.socialx`, `real.${value}`].filter(
        (s) => /^[a-z0-9._]{3,20}$/.test(s.toLowerCase()),
      )
    : [];

  return (
    <AuthShell
      step={6}
      eyebrow="Step 6 of 9"
      title="Choose your username"
      description="This is how people find and recognise you on SocialX. You can change it later in settings."
      footer={
        <PrimaryButton
          disabled={state !== "free"}
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => navigate({ to: "/signup/photo" }), 500);
          }}
        >
          Continue
        </PrimaryButton>
      }
    >
      <div
        className={`flex items-center rounded-2xl border px-4 transition-colors duration-200 ${
          state === "taken" || state === "invalid"
            ? "border-[oklch(0.5_0.19_25)]"
            : state === "free"
              ? "border-[oklch(1_0_0_/_60%)]"
              : "border-[oklch(1_0_0_/_16%)]"
        }`}
      >
        <span className="font-display mr-1 text-[19px] text-[oklch(1_0_0_/_45%)]">@</span>
        <input
          autoFocus
          value={value}
          onChange={(e) => set({ username: e.target.value.replace(/[^a-zA-Z0-9._]/g, "").toLowerCase() })}
          placeholder="username"
          autoCapitalize="none"
          autoComplete="off"
          aria-label="Username"
          className="h-[64px] flex-1 bg-transparent text-[19px] outline-none placeholder:text-[oklch(1_0_0_/_28%)]"
        />
        <span className="ml-2 flex size-6 items-center justify-center">
          {state === "checking" && (
            <Loader2 className="size-4 animate-spin text-[oklch(1_0_0_/_55%)]" />
          )}
          {state === "free" && (
            <span className="tap-pop flex size-6 items-center justify-center rounded-full bg-foreground">
              <Check className="size-3.5 text-background" strokeWidth={3} />
            </span>
          )}
          {(state === "taken" || state === "invalid") && (
            <span
              className="flex size-6 items-center justify-center rounded-full"
              style={{ background: "oklch(0.36 0.16 24)" }}
            >
              <X className="size-3.5" strokeWidth={3} />
            </span>
          )}
        </span>
      </div>

      <div className="mt-3.5 min-h-[20px] px-1 text-[13px]">
        {state === "empty" && (
          <p className="text-[oklch(1_0_0_/_48%)]">3–20 characters. Letters, numbers, dots and underscores.</p>
        )}
        {state === "invalid" && (
          <p className="text-[oklch(0.62_0.2_25)]">Use 3–20 letters, numbers, dots or underscores.</p>
        )}
        {state === "checking" && <p className="text-[oklch(1_0_0_/_48%)]">Checking availability…</p>}
        {state === "free" && <p className="reply-in text-foreground">@{value} is available</p>}
        {state === "taken" && (
          <p className="reply-in text-[oklch(0.62_0.2_25)]">@{value} is already taken</p>
        )}
      </div>

      {state === "taken" && suggestions.length > 0 && (
        <div className="reply-in mt-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[oklch(1_0_0_/_40%)]">
            Available instead
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set({ username: s.toLowerCase() })}
                className="rounded-full border border-[oklch(1_0_0_/_18%)] px-4 py-2 text-[13.5px] transition-colors active:bg-[oklch(1_0_0_/_7%)]"
              >
                @{s}
              </button>
            ))}
          </div>
        </div>
      )}
    </AuthShell>
  );
}
