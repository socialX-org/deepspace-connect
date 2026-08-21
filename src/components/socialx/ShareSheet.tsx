import { Link2, PlusSquare, Share2, Check } from "lucide-react";
import { useState } from "react";
import { shareTargets, type Post } from "@/lib/socialx-data";
import { Sheet } from "./Sheet";
import { cn } from "@/lib/utils";

export function ShareSheet({ post, onClose }: { post: Post; onClose: () => void }) {
  const [sent, setSent] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const link = typeof window !== "undefined" ? `${window.location.origin}/p/${post.id}` : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `${post.user} on SocialX`, text: post.caption, url: link });
      } catch {
        /* dismissed */
      }
    } else {
      copy();
    }
  };

  const rows = [
    { key: "story", label: "Share to Story", icon: PlusSquare, onClick: onClose },
    {
      key: "copy",
      label: copied ? "Link copied" : "Copy link",
      icon: copied ? Check : Link2,
      onClick: copy,
    },
    { key: "native", label: "Share via…", icon: Share2, onClick: nativeShare },
  ];

  return (
    <Sheet title="Share" onClose={onClose}>
      <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 py-5">
        {shareTargets.map((u) => {
          const done = sent.includes(u.id);
          return (
            <div key={u.id} className="flex w-[68px] shrink-0 flex-col items-center gap-2">
              <img
                src={u.avatar}
                alt={u.user}
                width={512}
                height={512}
                loading="lazy"
                className="size-14 rounded-full object-cover"
              />
              <span className="w-full truncate text-center text-[11.5px] text-foreground/85">
                {u.user}
              </span>
              <button
                onClick={() => setSent((s) => (done ? s : [...s, u.id]))}
                className={cn(
                  "w-full rounded-md border px-2 py-[4px] text-[11.5px] font-semibold transition-colors",
                  done
                    ? "border-border text-foreground/55"
                    : "border-foreground/80 text-foreground active:border-crimson active:text-crimson",
                )}
              >
                {done ? "Sent" : "Send"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="h-px w-full bg-[oklch(1_0_0_/_7%)]" />

      <div className="px-2 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-2">
        {rows.map((r) => (
          <button
            key={r.key}
            onClick={r.onClick}
            className="flex w-full items-center gap-4 rounded-xl px-3 py-3.5 text-left transition-colors active:bg-[oklch(1_0_0_/_5%)]"
          >
            <r.icon
              className={cn("size-[22px]", r.key === "copy" && copied ? "text-crimson" : "text-foreground")}
              strokeWidth={1.7}
            />
            <span className="text-[14px]">{r.label}</span>
          </button>
        ))}
      </div>
    </Sheet>
  );
}
