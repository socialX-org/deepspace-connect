import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AccountRow } from "@/components/socialx/AccountRow";
import { FollowSearch } from "@/components/socialx/FollowSearch";
import { FollowTabs } from "@/components/socialx/FollowTabs";
import { FollowTopBar } from "@/components/socialx/FollowTopBar";
import { profile, sampleFollowers, sampleSuggested } from "@/lib/socialx-data";

export const Route = createFileRoute("/followers")({
  component: FollowersPage,
  head: () => ({
    meta: [
      { title: "Followers — SocialX" },
      {
        name: "description",
        content: "Manage your SocialX followers and discover people to follow.",
      },
      { property: "og:title", content: "Followers — SocialX" },
      {
        property: "og:description",
        content: "Manage your SocialX followers and discover people to follow.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function FollowersPage() {
  const [query, setQuery] = useState("");

  const matches = (a: { user: string; name: string }) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      a.user.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
    );
  };

  const notFollowedBack = sampleFollowers.filter((a) => !a.isFollowing);
  const allFollowers = sampleFollowers;

  const filteredNotFollowed = notFollowedBack.filter(matches);
  const filteredAll = allFollowers.filter(matches);
  const filteredSuggested = sampleSuggested.filter(matches);

  return (
    <div className="min-h-screen bg-background pb-24">
      <FollowTopBar username={profile.user} />
      <FollowTabs
        followersCount={profile.followersCount}
        followingCount={profile.followingCount}
        active="followers"
      />

      <main className="mx-auto max-w-xl">
        <FollowSearch
          value={query}
          onChange={setQuery}
          placeholder="Search followers"
        />

        {filteredNotFollowed.length > 0 && (
          <section>
            <h2 className="px-4 pb-2 pt-4 text-[13px] font-semibold">
              Accounts you don&apos;t follow back
            </h2>
            {filteredNotFollowed.map((account) => (
              <AccountRow
                key={account.id}
                account={account}
                variant="followBack"
              />
            ))}
          </section>
        )}

        {filteredAll.length > 0 && (
          <section>
            <h2 className="px-4 pb-2 pt-4 text-[13px] font-semibold">
              All followers
            </h2>
            {filteredAll.map((account) => (
              <AccountRow key={account.id} account={account} />
            ))}
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
