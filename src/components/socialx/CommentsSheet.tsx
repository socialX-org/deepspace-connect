import { Heart, X } from "lucide-react";
import { comments as seed, profile, type Post } from "@/lib/socialx-data";

export function CommentsSheet({ post, onClose }: { post: Post; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/70" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-auto flex h-[80vh] w-full max-w-xl flex-col rounded-t-3xl border-t border-border bg-background"
      >
        <div className="flex items-center justify-between px-4 pb-3 pt-4">
          <span className="w-6" />
          <h2 className="font-display text-[15px] font-semibold">Comments</h2>
          <button onClick={onClose} aria-label="Close comments">
            <X className="size-5" strokeWidth={1.8} />
          </button>
        </div>
        <div className="h-px w-full bg-border" />

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
          {seed.map((c) => (
            <div key={c.id} className="flex gap-3">
              <img
                src={c.avatar}
                alt={c.user}
                width={512}
                height={512}
                loading="lazy"
                className="size-8 shrink-0 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-[13.5px] leading-relaxed">
                  <span className="font-semibold">{c.user}</span>{" "}
                  <span className="text-foreground/85">{c.text}</span>
                </p>
                <p className="mt-1 flex gap-4 text-[11px] text-muted-foreground">
                  <span>{c.time}</span>
                  <span>{c.likes} likes</span>
                  <span>Reply</span>
                </p>
              </div>
              <button aria-label="Like comment">
                <Heart className="size-4 text-foreground/60" strokeWidth={1.8} />
              </button>
            </div>
          ))}
          <p className="pt-2 text-center text-[11px] text-muted-foreground">
            Commenting on {post.user}'s post
          </p>
        </div>

        <div className="flex items-center gap-3 border-t border-border px-4 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3">
          <img
            src={profile.avatar}
            alt=""
            width={512}
            height={512}
            className="size-8 rounded-full object-cover"
          />
          <input
            placeholder="Add a comment…"
            className="h-10 flex-1 rounded-full border border-border bg-transparent px-4 text-[13.5px] outline-none placeholder:text-muted-foreground focus:border-white/25"
          />
          <button className="text-crimson text-[13.5px] font-semibold">Post</button>
        </div>
      </div>
    </div>
  );
}
