import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/settings")({
  component: Settings,
  head: () => ({
    meta: [
      { title: "Settings — SocialX" },
      { name: "description", content: "Manage your SocialX account, privacy and preferences." },
      { property: "og:title", content: "Settings — SocialX" },
      { property: "og:description", content: "Account, privacy and preferences on SocialX." },
    ],
  }),
});

const groups = [
  { title: "Account", items: ["Edit profile", "Saved", "Close friends", "Archive"] },
  { title: "Privacy", items: ["Private account", "Blocked accounts", "Story controls"] },
  { title: "Preferences", items: ["Notifications", "Language", "Data usage"] },
];

function Settings() {
  const router = useRouter();
  const navigate = useNavigate();
  const { signOut } = useSession();
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 bg-background/95 px-4 backdrop-blur-xl">
        <button onClick={() => router.history.back()} aria-label="Back">
          <ChevronLeft className="size-6" strokeWidth={1.8} />
        </button>
        <h1 className="font-display text-[17px] font-semibold tracking-tight">Settings</h1>
      </header>
      <div className="h-px w-full bg-border" />

      <main className="mx-auto max-w-xl">
        {groups.map((g) => (
          <section key={g.title} className="pt-6">
            <h2 className="px-4 font-display text-[12px] uppercase tracking-[0.16em] text-muted-foreground">
              {g.title}
            </h2>
            <div className="mt-2 divide-y divide-border border-y border-border">
              {g.items.map((i) => (
                <button
                  key={i}
                  className="flex w-full items-center justify-between px-4 py-3.5 text-left text-[14px]"
                >
                  {i}
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </section>
        ))}
        <button
          onClick={() => {
            void (async () => {
              await signOut();
              navigate({ to: "/welcome", replace: true });
            })();
          }}
          className="text-crimson mt-8 w-full py-3 text-[14px] font-semibold"
        >
          Log out
        </button>
      </main>
    </div>
  );
}
