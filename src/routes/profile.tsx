import { createFileRoute } from "@tanstack/react-router";
import { ProfileView } from "@/components/socialx/ProfileView";
import { profile } from "@/lib/socialx-data";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({
    meta: [
      { title: "Profile — SocialX" },
      {
        name: "description",
        content: "Your SocialX profile: posts, Clips, reposts and saved content in one black grid.",
      },
      { property: "og:title", content: "Profile — SocialX" },
      { property: "og:description", content: "Posts, Clips, reposts and saved content on SocialX." },
    ],
  }),
});

function Profile() {
  return <ProfileView profile={profile} isOwn />;
}
