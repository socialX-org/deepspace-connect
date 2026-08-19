import { createFileRoute, Link } from "@tanstack/react-router";
import { Grid3x3, Bookmark, Clapperboard, Settings } from "lucide-react";
import { useState } from "react";
import { exploreGrid, profile } from "@/lib/socialx-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({
    meta: [
      { title: "Profile — SocialX" },
      {
        name: "description",
        content: "Your SocialX profile: posts, Clips and saved content in one pure-black grid.",
      },
      { property: "og:title", content: "Profile — SocialX" },
      { property: "og:description", content: "Posts, Clips and saved content on SocialX." },
    ],
  }),
});

const tabs = [
  { id: "posts", icon: Grid3x3 },
  { id: "clips", icon: Clapperboard },
  { id: "saved", icon: Bookmark },
] as const;

function Profile() {
  const [tab, setTab] = useState<string>("posts");

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-background/95 px-4 backdrop-blur-xl">
        <h1 className="font-display text-[17px] font-semibold tracking-tight">{profile.user}</h1>
        <Link to="/settings" aria-label="Settings">
          <Settings className="size-[22px]" strokeWidth={1.7} />
        </Link>
      </header>
      <div className="h-px w-full bg-border" />

      <main className="mx-auto max-w-xl">
        <div className="flex items-center gap-6 px-4 pt-6">
          <span className="story-ring block shrink-0 rounded-full p-[3.5px]">
            <span className="block rounded-full bg-background p-[2.5px]">
              <img
                src={profile.avatar}
                alt={profile.name}
                width={512}
                height={512}
                className="size-[84px] rounded-full object-cover"
              />
            </span>
          </span>
          <div className="flex flex-1 justify-between text-center">
            {[
              ["Posts", profile.posts],
              ["Followers", profile.followers],
              ["Following", profile.following],
            ].map(([label, value]) => (
              <div key={label as string}>
                <p className="font-display text-[16px] font-semibold">{value}</p>
                <p className="text-[11.5px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 pt-4">
          <p className="text-[13.5px] font-semibold">{profile.name}</p>
          <p className="whitespace-pre-line text-[13px] leading-relaxed text-foreground/75">
            {profile.bio}
          </p>
        </div>

        <div className="flex gap-2 px-4 pt-4">
          <button className="flex-1 rounded-xl border border-border py-2 text-[13px] font-semibold">
            Edit profile
          </button>
          <button className="flex-1 rounded-xl border border-border py-2 text-[13px] font-semibold">
            Share profile
          </button>
        </div>

        <div className="mt-6 flex border-b border-border">
          {tabs.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              aria-label={id}
              className={cn(
                "flex flex-1 items-center justify-center py-3",
                tab === id ? "border-b-2 border-foreground" : "opacity-45",
              )}
            >
              <Icon className="size-[21px]" strokeWidth={1.8} />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-[2px] pt-[2px]">
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
      </main>
    </div>
  );
}
