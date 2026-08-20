import { createFileRoute } from "@tanstack/react-router";
import { ProfileView } from "@/components/socialx/ProfileView";
import { getUserProfile } from "@/lib/socialx-data";

export const Route = createFileRoute("/u/$username")({
  component: UserProfile,
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} — SocialX` },
      {
        name: "description",
        content: `View @${params.username} on SocialX: posts, Clips and reposts in a pure-black feed.`,
      },
      { property: "og:title", content: `@${params.username} — SocialX` },
      {
        property: "og:description",
        content: `Posts, Clips and reposts from @${params.username} on SocialX.`,
      },
    ],
  }),
});

function UserProfile() {
  const { username } = Route.useParams();
  return <ProfileView profile={getUserProfile(username)} isOwn={false} />;
}
