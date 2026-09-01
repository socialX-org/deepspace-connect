import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, MapPin, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { PrimaryButton } from "@/components/auth/controls";
import { useSignup } from "@/lib/signup-store";

export const Route = createFileRoute("/signup/profile")({
  component: ProfileStep,
  head: () => ({
    meta: [
      { title: "Complete your profile — SocialX" },
      {
        name: "description",
        content: "Optional: add a bio, your location and the interests that shape your SocialX feed.",
      },
      { property: "og:title", content: "Complete your profile — SocialX" },
      { property: "og:description", content: "Add a bio, location and interests — all optional." },
    ],
  }),
});

const PLACES = [
  "Lagos, Nigeria", "Abuja, Nigeria", "Accra, Ghana", "Nairobi, Kenya", "Cairo, Egypt",
  "London, United Kingdom", "Manchester, United Kingdom", "Berlin, Germany", "Paris, France",
  "Madrid, Spain", "Milan, Italy", "Amsterdam, Netherlands", "Lisbon, Portugal",
  "New York, United States", "Los Angeles, United States", "Chicago, United States",
  "Toronto, Canada", "Mexico City, Mexico", "São Paulo, Brazil", "Buenos Aires, Argentina",
  "Dubai, United Arab Emirates", "Istanbul, Türkiye", "Mumbai, India", "Delhi, India",
  "Singapore", "Tokyo, Japan", "Seoul, South Korea", "Shanghai, China", "Sydney, Australia",
];

const INTERESTS = [
  "Technology", "Science", "Gaming", "Football", "Music", "Movies",
  "Business", "Education", "Fashion", "Travel", "Art",
];

const MAX_BIO = 150;

function ProfileStep() {
  const navigate = useNavigate();
  const { data, set } = useSignup();
  const [locQuery, setLocQuery] = useState("");
  const [locOpen, setLocOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const term = locQuery.trim().toLowerCase();
  const results = useMemo(
    () => (term ? PLACES.filter((p) => p.toLowerCase().includes(term)).slice(0, 6) : PLACES.slice(0, 6)),
    [term],
  );

  const next = () => navigate({ to: "/signup/people" });

  const toggle = (i: string) =>
    set({
      interests: data.interests.includes(i)
        ? data.interests.filter((x) => x !== i)
        : [...data.interests, i],
    });

  return (
    <AuthShell
      step={8}
      eyebrow="Step 8 of 9 · Optional"
      title="Complete your profile"
      description="A few details help you personalise your profile and let SocialX surface people and content you'll actually care about. Every field here is optional."
      footer={
        <>
          <PrimaryButton
            loading={loading}
            onClick={() => {
              setLoading(true);
              setTimeout(next, 500);
            }}
          >
            Continue
          </PrimaryButton>
          <button
            type="button"
            onClick={next}
            className="mt-4 w-full text-center text-[13.5px] font-semibold text-[oklch(1_0_0_/_55%)] active:text-foreground"
          >
            Skip for now
          </button>
        </>
      }
    >
      {/* Bio */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[15px] font-semibold">Bio</h2>
          <span className="text-[12px] tabular-nums text-[oklch(1_0_0_/_42%)]">
            {data.bio.length}/{MAX_BIO}
          </span>
        </div>
        <textarea
          value={data.bio}
          maxLength={MAX_BIO}
          onChange={(e) => set({ bio: e.target.value })}
          placeholder="Say something true in one line."
          rows={3}
          className="mt-3 w-full resize-none rounded-2xl border border-[oklch(1_0_0_/_16%)] bg-transparent p-4 text-[15px] leading-relaxed outline-none transition-colors placeholder:text-[oklch(1_0_0_/_32%)] focus:border-[oklch(1_0_0_/_50%)]"
        />
      </section>

      {/* Location */}
      <section className="mt-9 border-t border-[oklch(1_0_0_/_8%)] pt-7">
        <h2 className="font-display text-[15px] font-semibold">Location</h2>
        <p className="mt-1.5 text-[13px] text-[oklch(1_0_0_/_48%)]">
          Shown on your profile only if you choose to display it.
        </p>

        {data.location && !locOpen ? (
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[oklch(1_0_0_/_50%)] px-4 py-3.5">
            <MapPin className="size-4" strokeWidth={1.8} />
            <span className="flex-1 text-[15px]">{data.location}</span>
            <button
              type="button"
              aria-label="Remove location"
              onClick={() => set({ location: "" })}
              className="flex size-8 items-center justify-center rounded-full active:scale-90"
            >
              <X className="size-4 text-[oklch(1_0_0_/_60%)]" strokeWidth={1.8} />
            </button>
          </div>
        ) : (
          <>
            <div className="mt-3 flex h-[52px] items-center gap-3 rounded-2xl border border-[oklch(1_0_0_/_16%)] px-4 focus-within:border-[oklch(1_0_0_/_50%)]">
              <Search className="size-4 text-[oklch(1_0_0_/_50%)]" strokeWidth={1.8} />
              <input
                value={locQuery}
                onFocus={() => setLocOpen(true)}
                onChange={(e) => setLocQuery(e.target.value)}
                placeholder="Search for a city"
                aria-label="Search for a location"
                className="h-full flex-1 bg-transparent text-[15px] outline-none placeholder:text-[oklch(1_0_0_/_32%)]"
              />
            </div>
            <div className="mt-2 overflow-hidden">
              {results.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    set({ location: p });
                    setLocQuery("");
                    setLocOpen(false);
                  }}
                  className="reply-in flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left active:bg-[oklch(1_0_0_/_6%)]"
                >
                  <MapPin className="size-4 text-[oklch(1_0_0_/_45%)]" strokeWidth={1.7} />
                  <span className="text-[14.5px]">{p}</span>
                </button>
              ))}
              {results.length === 0 && (
                <p className="px-2 py-4 text-[13.5px] text-[oklch(1_0_0_/_45%)]">
                  No place matches “{locQuery}”.
                </p>
              )}
            </div>
          </>
        )}
      </section>

      {/* Interests */}
      <section className="mt-9 border-t border-[oklch(1_0_0_/_8%)] pt-7">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[15px] font-semibold">Interests</h2>
          <span className="text-[12px] tabular-nums text-[oklch(1_0_0_/_42%)]">
            {data.interests.length} selected
          </span>
        </div>
        <p className="mt-1.5 text-[13px] text-[oklch(1_0_0_/_48%)]">
          Pick a few — we'll use them to shape your Discover and Clips.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {INTERESTS.map((i) => {
            const active = data.interests.includes(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13.5px] transition-all duration-200 active:scale-[0.97] ${
                  active
                    ? "border-[oklch(1_0_0_/_60%)] bg-[oklch(1_0_0_/_6%)] font-semibold"
                    : "border-[oklch(1_0_0_/_16%)] text-[oklch(1_0_0_/_72%)]"
                }`}
              >
                {active && <Check className="size-3.5" strokeWidth={2.6} />}
                {i}
              </button>
            );
          })}
        </div>
      </section>
    </AuthShell>
  );
}
