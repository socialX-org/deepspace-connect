import { createFileRoute, useRouter } from "@tanstack/react-router";
import { X, Image as ImageIcon, Clapperboard, CircleDot } from "lucide-react";
import { useState } from "react";
import { exploreGrid, profile } from "@/lib/socialx-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/create")({
  component: Create,
  head: () => ({
    meta: [
      { title: "Create — SocialX" },
      {
        name: "description",
        content: "Create a post, a Clip or a story on SocialX with a distraction-free composer.",
      },
      { property: "og:title", content: "Create — SocialX" },
      { property: "og:description", content: "Compose posts, Clips and stories on SocialX." },
    ],
  }),
});

const modes = [
  { id: "post", label: "Post", icon: ImageIcon },
  { id: "clip", label: "Clip", icon: Clapperboard },
  { id: "story", label: "Story", icon: CircleDot },
];

function Create() {
  const router = useRouter();
  const [mode, setMode] = useState("post");
  const [selected, setSelected] = useState(0);

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-background/95 px-4 backdrop-blur-xl">
        <button onClick={() => router.history.back()} aria-label="Close">
          <X className="size-6" strokeWidth={1.8} />
        </button>
        <h1 className="font-display text-[15px] font-semibold">New {mode}</h1>
        <button className="text-crimson text-[14px] font-semibold">Next</button>
      </header>
      <div className="h-px w-full bg-border" />

      <main className="mx-auto max-w-xl">
        <img
          src={exploreGrid[selected]}
          alt="Selected media"
          className="aspect-square w-full object-cover"
        />

        <div className="flex items-center gap-3 px-4 py-4">
          <img
            src={profile.avatar}
            alt=""
            width={512}
            height={512}
            className="size-8 rounded-full object-cover"
          />
          <input
            placeholder="Write a caption…"
            className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="h-px w-full bg-border" />

        <div className="flex gap-2 px-4 py-4">
          {modes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 text-[13px] font-semibold transition-colors",
                mode === id
                  ? "bg-crimson-gradient border-white/15"
                  : "border-border text-foreground/60",
              )}
            >
              <Icon className="size-4" strokeWidth={1.9} /> {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-[2px]">
          {exploreGrid.map((src, i) => (
            <button key={i} onClick={() => setSelected(i)} className="relative">
              <img
                src={src}
                alt=""
                loading="lazy"
                className={cn(
                  "aspect-square w-full object-cover transition-opacity",
                  selected === i ? "opacity-100" : "opacity-55",
                )}
              />
              {selected === i && <span className="absolute inset-0 ring-2 ring-inset ring-white" />}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
