import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AccountRow } from "@/components/socialx/AccountRow";
import { FollowSearch } from "@/components/socialx/FollowSearch";
import { FollowTabs } from "@/components/socialx/FollowTabs";
import { FollowTopBar } from "@/components/socialx/FollowTopBar";
import { profile, sampleFollowing, sampleSuggested } from "@/lib/socialx-data";

export const Route = createFileRoute("/following")({
  component: FollowingPage,
  head: () => ({
    meta: [
      { title: "Following — SocialX" },
      {
        name: "description",
        content: "Manage who you follow on SocialX and discover new people.",
      },
      { property: "og:title", content: "Following — SocialX" },
      {
        property: "og:description",
        content: "Manage who you follow on SocialX and discover new people.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const PREVIEW_LIMIT = 5;

function FollowingPage() {
  const [query, setQuery] = useState("");

  const matches = (a: { user: string; name: string }) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      a.user.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
    );
  };

  const filteredFollowing = sampleFollowing.filter(matches);
  const visibleFollowing = filteredFollowing.slice(0, PREVIEW_LIMIT);
  const hasMore = sampleFollowing.length > PREVIEW_LIMIT;
  const filteredSuggested = sampleSuggested.filter(matches);

  return (
    <div className="min-h-screen bg-background pb-24">
      <FollowTopBar username={profile.user} />
      <FollowTabs
        followersCount={profile.followersCount}
        followingCount={profile.followingCount}
        active="following"
      />

      <main className="mx-auto max-w-xl">
        <FollowSearch
          value={query}
          onChange={setQuery}
          placeholder="Search following"
        />

        {filteredFollowing.length > 0 && (
          <section>
            {visibleFollowing.map((account) => (
              <AccountRow key={account.id} account={account} />
            ))}
            {hasMore && (
              <button
                type="button"
                className="w-full py-3 text-center text-[13px] text-muted-foreground transition-colors active:text-crimson"
              >
                See all
              </button>
            )}
          </section>
        )}

        <section>
          <h2 className="px-4 pb-2 pt-4 text-[13px] font-semibold">
            Suggested for you
          </h2>
          {filteredSuggested.map((account) => (
            <AccountRow key={account.id} account={account} />
          ))}
        </section>
      </main>
    </div>
  );
}
