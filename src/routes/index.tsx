import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/socialx/TopBar";
import { StoryTray } from "@/components/socialx/StoryTray";
import { PostCard } from "@/components/socialx/PostCard";
import { posts } from "@/lib/socialx-data";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "SocialX — Feed" },
      {
        name: "description",
        content:
          "SocialX is a pure-black social platform: stories, posts and Clips in an elegant, minimal feed.",
      },
      { property: "og:title", content: "SocialX — Feed" },
      {
        property: "og:description",
        content: "A pure-black, premium social experience. Stories, posts and Clips.",
      },
    ],
  }),
});

function Home() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl">
        <TopBar />
        <StoryTray />
        <div className="h-px w-full bg-border" />
      </div>
      <main className="mx-auto max-w-xl pt-3">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
        <p className="pb-6 pt-2 text-center text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          You're all caught up
        </p>
      </main>
    </div>
  );
}
