import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, SquarePen, Search, X, BellOff } from "lucide-react";
import { useMemo, useState } from "react";
import { threads } from "@/lib/messages-data";
import { cn } from "@/lib/utils";

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
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return threads;
    return threads.filter(
      (t) =>
        t.user.toLowerCase().includes(term) ||
        t.name.toLowerCase().includes(term) ||
        t.last.toLowerCase().includes(term),
    );
  }, [q]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-xl items-center gap-3 px-4">
          <button onClick={() => router.history.back()} aria-label="Back">
            <ChevronLeft className="size-6" strokeWidth={1.8} />
          </button>
          <h1 className="flex-1 font-display text-[17px] font-semibold tracking-tight">Messages</h1>
          <Link to="/new-message" aria-label="New message">
            <SquarePen className="size-[21px]" strokeWidth={1.7} />
          </Link>
        </div>

        <div className="mx-auto max-w-xl px-4 pb-3">
          <div className="flex h-10 items-center gap-2.5 rounded-xl border border-border px-3">
            <Search className="size-[17px] text-foreground/55" strokeWidth={1.8} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search conversations and people"
              aria-label="Search messages"
              className="h-full flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-foreground/40"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Clear search">
                <X className="size-4 text-foreground/55" strokeWidth={1.9} />
              </button>
            )}
          </div>
        </div>
        <div className="h-px w-full bg-[oklch(1_0_0_/_7%)]" />
      </header>

      <main className="mx-auto max-w-xl">
        {list.length === 0 && (
          <p className="px-4 py-16 text-center text-[13px] text-muted-foreground">
            No conversations match “{q}”.
          </p>
        )}
        {list.map((c) => (
          <Link
            key={c.id}
            to="/chat/$id"
            params={{ id: c.id }}
            className="flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-[oklch(1_0_0_/_4%)]"
          >
            <div className="relative">
              <img
                src={c.avatar}
                alt={c.user}
                width={512}
                height={512}
                loading="lazy"
                className="size-[54px] rounded-full object-cover"
              />
              {c.presence.activeNow && !c.presence.hidden && (
                <span className="absolute bottom-0.5 right-0.5 size-3 rounded-full border-2 border-background bg-crimson" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-[14px] font-semibold">{c.user}</p>
                {c.muted && (
                  <BellOff className="size-3.5 shrink-0 text-foreground/40" strokeWidth={1.8} />
                )}
              </div>
              <p
                className={cn(
                  "truncate text-[12.5px]",
                  c.unread ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {c.last} · {c.time}
              </p>
            </div>
            {c.unread && <span className="bg-crimson-gradient size-2.5 shrink-0 rounded-full" />}
          </Link>
        ))}
      </main>
    </div>
  );
}
