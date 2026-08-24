import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { PrimaryButton } from "@/components/auth/controls";
import { useSignup } from "@/lib/signup-store";

export const Route = createFileRoute("/signup/birthday")({
  component: BirthdayStep,
  head: () => ({
    meta: [
      { title: "When's your birthday — SocialX" },
      { name: "description", content: "Tell SocialX your birthday so we can tailor a safer experience." },
      { property: "og:title", content: "When's your birthday — SocialX" },
      { property: "og:description", content: "Set your birthday for a safer, age-appropriate SocialX." },
    ],
  }),
});

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const now = new Date();
const YEARS = Array.from({ length: 100 }, (_, i) => now.getFullYear() - 13 - i);

function Wheel({
  items,
  value,
  onChange,
  label,
  render,
}: {
  items: number[];
  value: number;
  onChange: (v: number) => void;
  label: string;
  render?: (v: number) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ITEM = 44;

  useEffect(() => {
    const el = ref.current;
    const idx = items.indexOf(value);
    if (el && idx >= 0) el.scrollTop = idx * ITEM;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex-1">
      <p className="mb-2 text-center text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[oklch(1_0_0_/_40%)]">
        {label}
      </p>
      <div
        ref={ref}
        onScroll={(e) => {
          const idx = Math.round(e.currentTarget.scrollTop / ITEM);
          const next = items[Math.max(0, Math.min(items.length - 1, idx))];
          if (next !== undefined && next !== value) onChange(next);
        }}
        className="no-scrollbar h-[176px] snap-y snap-mandatory overflow-y-auto"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, #000 26%, #000 74%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 26%, #000 74%, transparent)",
        }}
      >
        <div style={{ height: ITEM * 1.5 }} />
        {items.map((it) => (
          <button
            key={it}
            type="button"
            onClick={() => onChange(it)}
            className={`flex h-[44px] w-full snap-center items-center justify-center text-[17px] tabular-nums transition-all duration-200 ${
              it === value
                ? "font-display font-semibold text-foreground"
                : "text-[oklch(1_0_0_/_35%)]"
            }`}
          >
            {render ? render(it) : it}
          </button>
        ))}
        <div style={{ height: ITEM * 1.5 }} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[calc(50%+8px)] h-[44px] -translate-y-1/2 rounded-xl border border-[oklch(1_0_0_/_14%)]"
      />
    </div>
  );
}

function BirthdayStep() {
  const navigate = useNavigate();
  const { data, set } = useSignup();
  const b = data.birthday ?? { d: 14, m: 6, y: 2000 };
  const [loading, setLoading] = useState(false);

  const daysInMonth = new Date(b.y, b.m, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const update = (patch: Partial<typeof b>) => {
    const next = { ...b, ...patch };
    next.d = Math.min(next.d, new Date(next.y, next.m, 0).getDate());
    set({ birthday: next });
  };

  const age = (() => {
    const today = new Date();
    let a = today.getFullYear() - b.y;
    const before =
      today.getMonth() + 1 < b.m || (today.getMonth() + 1 === b.m && today.getDate() < b.d);
    return before ? a - 1 : a;
  })();

  return (
    <AuthShell
      step={4}
      eyebrow="Step 4 of 9"
      title="When's your birthday?"
      description="This helps us give you an age-appropriate, safer SocialX. It's never shown publicly — only you decide to share it."
      footer={
        <PrimaryButton
          loading={loading}
          onClick={() => {
            set({ birthday: b });
            setLoading(true);
            setTimeout(() => navigate({ to: "/signup/gender" }), 500);
          }}
        >
          Continue
        </PrimaryButton>
      }
    >
      <div className="rounded-3xl border border-[oklch(1_0_0_/_12%)] px-3 py-5">
        <div className="flex gap-1">
          <Wheel label="Month" items={months} value={b.m} onChange={(m) => update({ m })} render={(m) => MONTHS[m - 1]!.slice(0, 3)} />
          <Wheel label="Day" items={days} value={b.d} onChange={(d) => update({ d })} />
          <Wheel label="Year" items={YEARS} value={b.y} onChange={(y) => update({ y })} />
        </div>
      </div>

      <p className="mt-6 text-center text-[15px]">
        <span className="text-[oklch(1_0_0_/_50%)]">You'll turn </span>
        <span className="font-display font-semibold">{age + 1}</span>
        <span className="text-[oklch(1_0_0_/_50%)]"> this year — born </span>
        <span className="font-semibold">
          {MONTHS[b.m - 1]} {b.d}, {b.y}
        </span>
      </p>
    </AuthShell>
  );
}
