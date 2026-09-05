import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, PrimaryButton } from "@/components/auth/controls";
import { sendRecoveryCode } from "@/lib/auth";
import { isEmail, isPhone, useRecovery } from "@/lib/recovery-store";

export const Route = createFileRoute("/recover/")({
  component: FindAccount,
  head: () => ({
    meta: [
      { title: "Find your account — SocialX" },
      {
        name: "description",
        content:
          "Enter the email address or mobile number linked to your SocialX account to start recovery.",
      },
      { property: "og:title", content: "Find your account — SocialX" },
      { property: "og:description", content: "Start recovering access to your SocialX account." },
    ],
  }),
});

function FindAccount() {
  const navigate = useNavigate();
  const { set } = useRecovery();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const valid = isEmail(value) || isPhone(value);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (loading) return;
    if (!valid) {
      setError("Enter a valid email address or mobile number.");
      return;
    }
    setError(null);
    setLoading(true);
    void (async () => {
      const method = isEmail(value) ? "email" : "phone";
      const identifier =
        method === "email"
          ? value.trim()
          : value.trim().startsWith("+")
            ? value.replace(/[^\d+]/g, "")
            : `+${value.replace(/\D/g, "")}`;
      const err = await sendRecoveryCode(
        method === "email" ? { method, email: identifier } : { method, phone: identifier },
      );
      if (err) {
        setLoading(false);
        setError(err);
        return;
      }
      const handle =
        method === "email"
          ? (identifier.split("@")[0] ?? "you").replace(/[^a-z0-9._]/gi, "").toLowerCase()
          : `sx${identifier.slice(-4)}`;
      set({ identifier, method, username: handle, fullName: handle, verified: false });
      navigate({ to: "/recover/code" });
    })();
  };

  return (
    <AuthShell
      title="Find your account"
      description="Enter the email address or mobile number associated with your SocialX account and we'll send a recovery code."
      onBack={() => navigate({ to: "/signin" })}
      footer={
        <>
          <PrimaryButton onClick={() => submit()} disabled={!valid} loading={loading}>
            Continue
          </PrimaryButton>
          <button
            type="button"
            onClick={() => navigate({ to: "/signin" })}
            className="mt-4 w-full text-center text-[13px] text-[oklch(1_0_0_/_50%)] active:text-foreground"
          >
            Back to sign in
          </button>
        </>
      }
    >
      <form onSubmit={submit}>
        <Field
          label="Email or mobile number"
          value={value}
          autoComplete="username"
          inputMode="email"
          error={error}
          hint="We'll only use this to confirm the account is yours."
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
        />
      </form>
    </AuthShell>
  );
}
