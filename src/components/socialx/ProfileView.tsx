import { Link } from "@tanstack/react-router";
import { Grid3x3, Bookmark, Clapperboard, Repeat2, Settings, ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import { exploreGrid } from "@/lib/socialx-data";
import { cn } from "@/lib/utils";

export type ProfileData = {
  user: string;
  name: string;
  avatar: string;
  bio: string;
  posts: number | string;
  followers: number | string;
  following: number | string;
};

const baseTabs = [
  { id: "posts", icon: Grid3x3 },
  { id: "clips", icon: Clapperboard },
  { id: "repost", icon: Repeat2 },
] as const;

export function ProfileView({ profile, isOwn }: { profile: ProfileData; isOwn: boolean }) {
  const [tab, setTab] = useState<string>("posts");
  const [following, setFollowing] = useState(false);

  const tabs = isOwn ? [...baseTabs, { id: "saved", icon: Bookmark } as const] : baseTabs;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-background/95 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {!isOwn && (
            <Link to="/" aria-label="Back">
              <ArrowLeft className="size-[22px]" strokeWidth={1.8} />
            </Link>
          )}
          <h1 className="font-display text-[17px] font-semibold tracking-tight">{profile.user}</h1>
        </div>
        {isOwn && (
          <Link to="/settings" aria-label="Settings">
            <Settings className="size-[22px]" strokeWidth={1.7} />
          </Link>
        )}
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
          <div className="flex flex-1 justify-between">
            {[
              ["Posts", profile.posts, null],
              ["Followers", profile.followers, "/followers"],
              ["Following", profile.following, "/following"],
            ].map(([label, value, to]) => {
              const content = (
                <>
                  <p className="font-display text-[16px] font-semibold">
                    {value}
                  </p>
                  <p className="text-[11.5px] text-muted-foreground">{label}</p>
                </>
              );
              return (
                <div key={label as string} className="text-center">
                  {isOwn && to ? (
                    <Link to={to} className="block">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-4 pt-4">
          <p className="text-[13.5px] font-semibold">{profile.name}</p>
          <p className="whitespace-pre-line text-[13px] leading-relaxed text-foreground/75">
            {profile.bio}
          </p>
        </div>

        {isOwn ? (
          <div className="flex gap-2 px-4 pt-4">
            <button className="flex-1 rounded-xl border border-border py-2 text-[13px] font-semibold">
              Edit profile
            </button>
            <button className="flex-1 rounded-xl border border-border py-2 text-[13px] font-semibold">
              Share profile
            </button>
          </div>
        ) : (
          <div className="flex items-stretch gap-2 px-4 pt-4">
            <button
              onClick={() => setFollowing((f) => !f)}
              aria-pressed={following}
              className={cn(
                "flex-1 rounded-xl py-2 text-[13px] font-semibold transition-colors duration-200",
                "active:border-crimson active:text-crimson",
                following
                  ? "border border-border bg-background text-foreground/60"
                  : "border border-foreground/80 bg-background text-foreground",
              )}
            >
              {following ? "Following" : "Follow"}
            </button>
            <button className="flex-1 rounded-xl border border-border py-2 text-[13px] font-semibold">
              Message
            </button>
            <button
              aria-label="Share profile"
              className="flex w-11 shrink-0 items-center justify-center rounded-xl border border-border active:border-crimson active:text-crimson"
            >
              <Send className="size-[17px]" strokeWidth={1.8} />
            </button>
          </div>
        )}

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
