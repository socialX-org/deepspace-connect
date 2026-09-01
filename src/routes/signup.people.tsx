import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { PrimaryButton } from "@/components/auth/controls";
import { avatars } from "@/lib/socialx-data";
import { useSignup } from "@/lib/signup-store";

export const Route = createFileRoute("/signup/people")({
  component: PeopleStep,
  head: () => ({
    meta: [
      { title: "People you may want to follow — SocialX" },
      {
        name: "description",
        content: "Follow a few accounts picked from your interests to fill your SocialX feed.",
      },
      { property: "og:title", content: "People you may want to follow — SocialX" },
      { property: "og:description", content: "Follow a few accounts to fill your feed." },
    ],
  }),
});

const PEOPLE = [
  { user: "mara.k", name: "Mara Kessler", note: "Photography · Berlin", avatar: avatars.avatar1 },
  { user: "orenlab", name: "Oren Lab", note: "Design studio", avatar: avatars.avatar2 },
  { user: "nightform", name: "Night Form", note: "Music · Clips", avatar: avatars.avatar2 },
  { user: "sable", name: "Sable Ade", note: "Fashion editor", avatar: avatars.avatar1 },
  { user: "elias", name: "Elias Moreau", note: "Architecture", avatar: avatars.avatar2 },
  { user: "juno", name: "Juno Ibe", note: "Technology writer", avatar: avatars.avatar1 },
  { user: "atlas.fc", name: "Atlas FC", note: "Football", avatar: avatars.avatar2 },
];

function PeopleStep() {
  const navigate = useNavigate();
  const { data, set } = useSignup();
  const [loading, setLoading] = useState(false);

  const toggle = (u: string) =>
    set({
      following: data.following.includes(u)
        ? data.following.filter((x) => x !== u)
        : [...data.following, u],
    });

  const finish = () => {
    setLoading(true);
    setTimeout(() => navigate({ to: "/" }), 700);
  };

  const count = data.following.length;

  return (
    <AuthShell
      step={9}
      eyebrow="Step 9 of 9 · Optional"
      title="People you may want to follow"
      description={
        data.interests.length
          ? `Chosen from your interests — ${data.interests.slice(0, 3).join(", ")}${data.interests.length > 3 ? " and more" : ""}. Following a few makes your first feed feel alive.`
          : "A few accounts to start with. Following a few makes your first feed feel alive."
      }
      footer={
        <>
          <PrimaryButton onClick={finish} loading={loading}>
            {count > 0 ? `Continue with ${count} following` : "Continue"}
          </PrimaryButton>
          <button
            type="button"
            onClick={finish}
            className="mt-4 w-full text-center text-[13.5px] font-semibold text-[oklch(1_0_0_/_55%)] active:text-foreground"
          >
            Skip for now
          </button>
        </>
      }
    >
      <ul className="-mt-2 divide-y divide-[oklch(1_0_0_/_7%)]">
        {PEOPLE.map((p) => {
          const following = data.following.includes(p.user);
          return (
            <li key={p.user} className="flex items-center gap-3.5 py-3.5">
              <img
                src={p.avatar}
                alt={`${p.name} profile picture`}
                loading="lazy"
                className="size-12 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14.5px] font-semibold">{p.user}</p>
                <p className="truncate text-[13px] text-[oklch(1_0_0_/_50%)]">
                  {p.name} · {p.note}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggle(p.user)}
                aria-pressed={following}
                className={`h-9 min-w-[92px] rounded-full border px-4 text-[13px] font-semibold transition-all duration-200 active:scale-[0.96] active:border-[oklch(0.44_0.18_24_/_85%)] ${
                  following
                    ? "border-[oklch(1_0_0_/_18%)] text-[oklch(1_0_0_/_62%)]"
                    : "border-[oklch(1_0_0_/_45%)] text-foreground"
                }`}
              >
                {following ? "Following" : "Follow"}
              </button>
            </li>
          );
        })}
      </ul>
    </AuthShell>
  );
}
