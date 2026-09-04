import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { CountryPicker } from "@/components/auth/CountryPicker";
import { Field, PrimaryButton } from "@/components/auth/controls";
import { countries, defaultCountry, type Country } from "@/lib/countries";
import { useSignup } from "@/lib/signup-store";

export const Route = createFileRoute("/signup/")({
  component: ContactStep,
  head: () => ({
    meta: [
      { title: "Create your SocialX account" },
      {
        name: "description",
        content: "Sign up for SocialX with an email address or your phone number.",
      },
      { property: "og:title", content: "Create your SocialX account" },
      { property: "og:description", content: "Sign up with an email address or phone number." },
    ],
  }),
});

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim());

function ContactStep() {
  const navigate = useNavigate();
  const { data, set } = useSignup();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const country = useMemo<Country>(
    () => countries.find((c) => c.dial === data.dial) ?? defaultCountry,
    [data.dial],
  );

  const isEmail = data.method === "email";
  const phoneDigits = data.phone.replace(/\D/g, "");
  const valid = isEmail ? emailOk(data.email) : phoneDigits.length >= 6;
  const error = !touched
    ? null
    : isEmail
      ? data.email && !valid
        ? "That email address doesn't look right."
        : null
      : data.phone && !valid
        ? "Enter a valid phone number."
        : null;

  const [sendError, setSendError] = useState<string | null>(null);

  const submit = async () => {
    setTouched(true);
    if (!valid || loading) return;
    setSendError(null);
    setLoading(true);
    const err = await sendSignupCode(
      isEmail
        ? { method: "email", email: data.email }
        : { method: "phone", phone: fullPhone(data.dial, data.phone) },
    );
    if (err) {
      setLoading(false);
      setSendError(err);
      return;
    }
    navigate({ to: "/signup/verify" });
  };

  return (
    <>
      <AuthShell
        step={1}
        eyebrow="Step 1 of 9"
        title={isEmail ? "What's your email address?" : "What's your phone number?"}
        description={
          isEmail
            ? "We'll send a six-digit code to confirm it's really you. Your address stays private."
            : "We'll text you a six-digit code. Your number is never shown on your profile."
        }
        onBack={() => navigate({ to: "/welcome" })}
        footer={
          <>
            <PrimaryButton onClick={submit} loading={loading} disabled={!valid}>
              {loading ? "Sending code" : "Continue"}
            </PrimaryButton>
            <p className="pt-4 text-center text-[13px] text-[oklch(1_0_0_/_50%)]">
              Already have an account?{" "}
              <span className="font-semibold text-foreground">Log in</span>
            </p>
          </>
        }
      >
        <div
          role="tablist"
          aria-label="Sign up method"
          className="relative mb-7 grid grid-cols-2 rounded-full border border-[oklch(1_0_0_/_14%)] p-1"
        >
          <span
            aria-hidden
            className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-foreground transition-transform duration-300 ease-out"
            style={{ transform: isEmail ? "translateX(0.25rem)" : "translateX(calc(100% + 0.25rem))" }}
          />
          {(["email", "phone"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={data.method === m}
              onClick={() => {
                set({ method: m });
                setTouched(false);
              }}
              className={`relative z-10 h-10 rounded-full text-[13.5px] font-semibold transition-colors duration-200 ${
                data.method === m ? "text-background" : "text-[oklch(1_0_0_/_60%)]"
              }`}
            >
              {m === "email" ? "Email address" : "Phone number"}
            </button>
          ))}
        </div>

        {isEmail ? (
          <Field
            key="email"
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
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        ) : (
          <div className="flex items-start gap-2.5">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex h-[64px] shrink-0 items-center gap-2 rounded-2xl border border-[oklch(1_0_0_/_16%)] px-3.5 transition-colors active:border-[oklch(1_0_0_/_45%)]"
            >
              <span className="text-[20px] leading-none">{country.flag}</span>
              <span className="text-[15px] font-medium">{country.dial}</span>
              <ChevronDown className="size-4 text-[oklch(1_0_0_/_50%)]" strokeWidth={1.8} />
            </button>
            <Field
              key="phone"
              label="Phone number"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={data.phone}
              error={error}
              hint={`Sending to ${country.name}`}
              onChange={(e) => set({ phone: e.target.value.replace(/[^\d\s-]/g, "") })}
              onBlur={() => setTouched(true)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>
        )}
      </AuthShell>

      {pickerOpen && (
        <CountryPicker
          value={country}
          onSelect={(c) => set({ dial: c.dial })}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  );
}
