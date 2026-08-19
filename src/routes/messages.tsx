import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft, SquarePen } from "lucide-react";
import { conversations } from "@/lib/socialx-data";

export const Route = createFileRoute("/messages")({
  component: Messages,
  head: () => ({
    meta: [
      { title: "Messages — SocialX" },
      { name: "description", content: "Direct conversations and shared Clips on SocialX." },
      { property: "og:title", content: "Messages — SocialX" },
      { property: "og:description", content: "Your SocialX direct conversations." },
    ],
  }),
});

function Messages() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 bg-background/95 px-4 backdrop-blur-xl">
        <button onClick={() => router.history.back()} aria-label="Back">
          <ChevronLeft className="size-6" strokeWidth={1.8} />
        </button>
        <h1 className="flex-1 font-display text-[17px] font-semibold tracking-tight">Messages</h1>
        <SquarePen className="size-[21px]" strokeWidth={1.7} />
      </header>
      <div className="h-px w-full bg-border" />

      <main className="mx-auto max-w-xl">
        {conversations.map((c) => (
          <div key={c.id} className="flex items-center gap-3 px-4 py-3.5">
            <img
              src={c.avatar}
              alt={c.user}
              width={512}
              height={512}
              loading="lazy"
              className="size-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-[14px] font-semibold">{c.user}</p>
              <p className="text-[12.5px] text-muted-foreground">
                {c.last} · {c.time}
              </p>
            </div>
            {c.unread && <span className="bg-crimson-gradient size-2.5 rounded-full" />}
          </div>
        ))}
      </main>
    </div>
  );
}
