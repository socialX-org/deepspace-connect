import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { recentPeople, suggestedPeople } from "@/lib/messages-data";

export const Route = createFileRoute("/new-message")({
  component: NewMessage,
  head: () => ({
    meta: [
      { title: "New message — SocialX" },
      { name: "description", content: "Start a new SocialX conversation with anyone you follow." },
      { property: "og:title", content: "New message — SocialX" },
      { property: "og:description", content: "Start a new SocialX conversation." },
    ],
  }),
});

function NewMessage() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const term = q.trim().toLowerCase();
  const filter = <T extends { user: string; name: string }>(arr: T[]) =>
    term
      ? arr.filter(
          (u) => u.user.toLowerCase().includes(term) || u.name.toLowerCase().includes(term),
        )
      : arr;

  const recents = useMemo(() => filter(recentPeople), [term]);
  const suggested = useMemo(() => filter(suggestedPeople), [term]);
  const empty = recents.length === 0 && suggested.length === 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-xl items-center gap-3 px-4">
          <button onClick={() => router.history.back()} aria-label="Back">
            <ChevronLeft className="size-6" strokeWidth={1.8} />
          </button>
          <h1 className="flex-1 font-display text-[17px] font-semibold tracking-tight">
            New message
          </h1>
        </div>
        <div className="mx-auto max-w-xl px-4 pb-3">
          <div className="flex h-10 items-center gap-2.5 rounded-xl border border-border px-3">
            <Search className="size-[17px] text-foreground/55" strokeWidth={1.8} />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by username"
              aria-label="Search people"
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
        {empty && (
          <p className="px-4 py-16 text-center text-[13px] text-muted-foreground">
            No people match “{q}”.
          </p>
        )}

        {recents.length > 0 && <SectionLabel>Recent</SectionLabel>}
        {recents.map((u) => (
          <PersonRow key={u.id} to={u.id} {...u} />
        ))}

        {suggested.length > 0 && <SectionLabel>Suggested</SectionLabel>}
        {suggested.map((u) => (
          <PersonRow key={u.id} to="1" {...u} />
        ))}
      </main>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="px-4 pb-2 pt-5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-foreground/45">
      {children}
    </p>
  );
}

function PersonRow({
  to,
  user,
  name,
  avatar,
}: {
  to: string;
  user: string;
  name: string;
  avatar: string;
}) {
  return (
    <Link
      to="/chat/$id"
      params={{ id: to }}
      className="flex items-center gap-3 px-4 py-3 transition-colors active:bg-[oklch(1_0_0_/_4%)]"
    >
      <img
        src={avatar}
        alt={user}
        width={512}
        height={512}
        loading="lazy"
        className="size-12 rounded-full object-cover"
      />
      <div className="min-w-0">
        <p className="truncate text-[14px] font-semibold">{user}</p>
        <p className="truncate text-[12.5px] text-muted-foreground">{name}</p>
      </div>
    </Link>
  );
}
