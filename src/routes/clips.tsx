import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessageCircle, Repeat2, Send, Music2 } from "lucide-react";
import { useState } from "react";
import { clips } from "@/lib/socialx-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/clips")({
  component: Clips,
  head: () => ({
    meta: [
      { title: "Clips — SocialX" },
      {
        name: "description",
        content: "Clips: SocialX's full-screen short-form video experience on a pure-black canvas.",
      },
      { property: "og:title", content: "Clips — SocialX" },
      {
        property: "og:description",
        content: "Full-screen short-form video, SocialX style.",
      },
    ],
  }),
});

function Clip({ clip }: { clip: (typeof clips)[number] }) {
  const [liked, setLiked] = useState(false);
  return (
    <section className="relative h-[100svh] w-full snap-start overflow-hidden bg-background">
      <img src={clip.image} alt={clip.caption} className="h-full w-full object-cover opacity-90" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent" />

      <div className="absolute bottom-28 left-4 right-20 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <img
            src={clip.avatar}
            alt={clip.user}
            width={512}
            height={512}
            className="size-8 rounded-full object-cover"
          />
          <span className="text-[13.5px] font-semibold">{clip.user}</span>
          <button className="rounded-full border border-white/40 px-3 py-[3px] text-[11.5px] font-semibold">
            Follow
          </button>
        </div>
        <p className="text-[13.5px] leading-relaxed text-foreground/90">{clip.caption}</p>
        <p className="flex items-center gap-2 text-[11.5px] text-foreground/70">
          <Music2 className="size-3.5" /> {clip.audio}
        </p>
      </div>

      <div className="absolute bottom-28 right-3 flex flex-col items-center gap-6">
        <button onClick={() => setLiked((l) => !l)} className="flex flex-col items-center gap-1">
          <Heart
            className={cn("size-7", liked ? "text-crimson tap-pop" : "text-foreground")}
            fill={liked ? "currentColor" : "none"}
            strokeWidth={1.8}
          />
          <span className="text-[11px]">{clip.likes}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <MessageCircle className="size-7 -scale-x-100" strokeWidth={1.8} />
          <span className="text-[11px]">{clip.comments}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Repeat2 className="size-7" strokeWidth={1.9} />
          <span className="text-[11px]">Repost</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Send className="size-6" strokeWidth={1.8} />
          <span className="text-[11px]">Share</span>
        </button>
      </div>
    </section>
  );
}

function Clips() {
  return (
    <div className="h-[100svh] snap-y snap-mandatory overflow-y-auto bg-background">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-4">
        <h1 className="font-display text-[17px] font-semibold tracking-tight">Clips</h1>
      </div>
      {clips.map((c) => (
        <Clip key={c.id} clip={c} />
      ))}
    </div>
  );
}
