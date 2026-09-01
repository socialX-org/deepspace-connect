import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, PrimaryButton } from "@/components/auth/controls";
import { useSignup } from "@/lib/signup-store";

export const Route = createFileRoute("/signup/gender")({
  component: GenderStep,
  head: () => ({
    meta: [
      { title: "What's your gender — SocialX" },
      { name: "description", content: "Choose how you'd like to be described on SocialX." },
      { property: "og:title", content: "What's your gender — SocialX" },
      { property: "og:description", content: "Choose how you'd like to be described on SocialX." },
    ],
  }),
});

const OPTIONS = ["Female", "Male", "Non-binary", "Prefer not to say", "Custom"];

function GenderStep() {
  const navigate = useNavigate();
  const { data, set } = useSignup();
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = data.gender;
  const valid = selected === "Custom" ? custom.trim().length > 0 : selected.length > 0;

  return (
    <AuthShell
      step={5}
      eyebrow="Step 5 of 9"
      title="What's your gender?"
      description="This helps us keep recommendations relevant. It stays private on your profile unless you choose to show it."
      footer={
        <PrimaryButton
          disabled={!valid}
          loading={loading}
          onClick={() => {
            if (selected === "Custom") set({ gender: custom.trim() });
            setLoading(true);
            setTimeout(() => navigate({ to: "/signup/username" }), 500);
          }}
        >
          Continue
        </PrimaryButton>
      }
    >
      <div className="space-y-2.5">
        {OPTIONS.map((opt) => {
          const active = selected === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => set({ gender: opt })}
              aria-pressed={active}
              className={`flex h-[60px] w-full items-center justify-between rounded-2xl border px-5 text-left transition-all duration-200 active:scale-[0.99] ${
                active
                  ? "border-[oklch(1_0_0_/_60%)] bg-[oklch(1_0_0_/_5%)]"
                  : "border-[oklch(1_0_0_/_14%)]"
              }`}
            >
              <span className={`text-[15px] ${active ? "font-semibold" : "text-[oklch(1_0_0_/_78%)]"}`}>
                {opt}
              </span>
              <span
                className={`flex size-[22px] items-center justify-center rounded-full border transition-all duration-200 ${
                  active ? "border-transparent bg-crimson-gradient" : "border-[oklch(1_0_0_/_22%)]"
                }`}
              >
                {active && <Check className="size-3.5 text-foreground" strokeWidth={2.6} />}
              </span>
            </button>
          );
        })}
      </div>

      {selected === "Custom" && (
        <div className="reply-in mt-4">
          <Field
            label="Describe yourself"
            value={custom}
            autoFocus
            onChange={(e) => setCustom(e.target.value)}
            hint="Use the words that fit you best."
          />
        </div>
      )}
    </AuthShell>
  );
}
