import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { exploreGrid, suggestedUsers, trending } from "@/lib/socialx-data";

export const Route = createFileRoute("/discover")({
  component: Discover,
  head: () => ({
    meta: [
      { title: "Discover — SocialX" },
      {
        name: "description",
        content: "Search SocialX, find creators to follow and explore trending posts and Clips.",
      },
      { property: "og:title", content: "Discover — SocialX" },
      {
        property: "og:description",
        content: "Search, recommended creators and trending content on SocialX.",
      },
    ],
  }),
});

function Discover() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-40 bg-background/95 px-4 pb-3 pt-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl items-center gap-3 rounded-full border border-border px-4 py-2.5">
          <Search className="size-4 text-muted-foreground" strokeWidth={2} />
          <input
            placeholder="Search people, tags, Clips"
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="h-px w-full bg-border" />

      <main className="mx-auto max-w-xl">
        <section className="px-4 pt-5">
          <h2 className="font-display text-[13px] uppercase tracking-[0.16em] text-muted-foreground">
            Suggested for you
          </h2>
          <div className="no-scrollbar -mx-4 mt-4 flex gap-3 overflow-x-auto px-4">
            {suggestedUsers.map((u) => (
              <div
                key={u.id}
                className="flex w-[142px] shrink-0 flex-col items-center gap-2 rounded-2xl border border-border px-3 py-4"
              >
                <img
                  src={u.avatar}
                  alt={u.user}
                  width={512}
                  height={512}
                  loading="lazy"
                  className="size-16 rounded-full object-cover"
                />
                <p className="text-[13px] font-semibold">{u.user}</p>
                <p className="line-clamp-1 text-[11px] text-muted-foreground">{u.meta}</p>
                <button className="bg-crimson-gradient mt-1 w-full rounded-full py-1.5 text-[12px] font-semibold text-foreground">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pt-7">
          <h2 className="font-display text-[13px] uppercase tracking-[0.16em] text-muted-foreground">
            Trending
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {trending.map((t) => (
              <span
                key={t.tag}
                className="rounded-full border border-border px-3.5 py-1.5 text-[12.5px]"
              >
                {t.tag}
                <span className="ml-2 text-muted-foreground">{t.posts}</span>
              </span>
            ))}
          </div>
        </section>

        <section className="pt-7">
          <h2 className="px-4 font-display text-[13px] uppercase tracking-[0.16em] text-muted-foreground">
            Explore
          </h2>
          <div className="mt-3 grid grid-cols-3 gap-[2px]">
            {exploreGrid.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
