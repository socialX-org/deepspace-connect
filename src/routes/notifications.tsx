import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { notifications } from "@/lib/socialx-data";

export const Route = createFileRoute("/notifications")({
  component: Notifications,
  head: () => ({
    meta: [
      { title: "Notifications — SocialX" },
      {
        name: "description",
        content: "Likes, follows, comments and reposts across your SocialX activity.",
      },
      { property: "og:title", content: "Notifications — SocialX" },
      { property: "og:description", content: "Your latest SocialX activity in one place." },
    ],
  }),
});

function Notifications() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 bg-background/95 px-4 backdrop-blur-xl">
        <button onClick={() => router.history.back()} aria-label="Back">
          <ChevronLeft className="size-6" strokeWidth={1.8} />
        </button>
        <h1 className="font-display text-[17px] font-semibold tracking-tight">Notifications</h1>
      </header>
      <div className="h-px w-full bg-border" />

      <main className="mx-auto max-w-xl divide-y divide-border">
        {notifications.map((n) => (
          <div key={n.id} className="flex items-center gap-3 px-4 py-3.5">
            <img
              src={n.avatar}
              alt={n.user}
              width={512}
              height={512}
              loading="lazy"
              className="size-10 rounded-full object-cover"
            />
            <p className="flex-1 text-[13.5px] leading-relaxed">
              <span className="font-semibold">{n.user}</span>{" "}
              <span className="text-foreground/80">{n.text}</span>{" "}
              <span className="text-muted-foreground">{n.time}</span>
            </p>
            <button className="bg-crimson-gradient rounded-full px-4 py-1.5 text-[12.5px] font-semibold">
              Follow
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}
