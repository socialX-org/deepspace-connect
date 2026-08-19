import { Heart, MessageCircle, Repeat2, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import type { Post } from "@/lib/socialx-data";
import { CommentsSheet } from "./CommentsSheet";
import { cn } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [burst, setBurst] = useState(0);
  const [comments, setComments] = useState(false);
  const lastTap = useRef(0);

  const like = () => {
    setLiked(true);
    setBurst((b) => b + 1);
  };

  const onMediaTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) like();
    lastTap.current = now;
  };

  const likeCount = post.likes + (liked ? 1 : 0);

  return (
    <article className="pb-7">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="story-ring block rounded-full p-[2px]">
            <span className="block rounded-full bg-background p-[2px]">
              <img
                src={post.avatar}
                alt={post.user}
                width={512}
                height={512}
                loading="lazy"
                className="size-8 rounded-full object-cover"
              />
            </span>
          </span>
          <div className="leading-tight">
            <p className="text-[13.5px] font-semibold tracking-tight">{post.user}</p>
            {post.location && (
              <p className="text-[11px] text-muted-foreground">{post.location}</p>
            )}
          </div>
        </div>
        <button aria-label="More options">
          <MoreHorizontal className="size-5 text-foreground/70" />
        </button>
      </div>

      <div
        className="relative select-none overflow-hidden"
        onClick={onMediaTap}
        role="presentation"
      >
        <img
          src={post.image}
          alt={post.caption}
          width={1080}
          height={1350}
          loading="lazy"
          className="w-full object-cover"
        />
        {burst > 0 && (
          <Heart
            key={burst}
            className="heart-pop pointer-events-none absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 text-foreground drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)]"
            fill="currentColor"
          />
        )}
      </div>

      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-5">
          <button
            aria-label="Like"
            onClick={() => (liked ? setLiked(false) : like())}
            className={cn(liked && "tap-pop")}
          >
            <Heart
              className={cn("size-[25px]", liked ? "text-crimson" : "text-foreground")}
              fill={liked ? "currentColor" : "none"}
              strokeWidth={1.8}
            />
          </button>
          <button aria-label="Comment" onClick={() => setComments(true)}>
            <MessageCircle className="size-[25px] -scale-x-100 text-foreground" strokeWidth={1.8} />
          </button>
          <button aria-label="Repost" onClick={() => setReposted((r) => !r)}>
            <Repeat2
              className={cn("size-[26px]", reposted ? "text-crimson" : "text-foreground")}
              strokeWidth={1.9}
            />
          </button>
          <button aria-label="Share">
            <Send className="size-[24px] text-foreground" strokeWidth={1.8} />
          </button>
        </div>
        <button aria-label="Save" onClick={() => setSaved((s) => !s)}>
          <Bookmark
            className={cn("size-[24px] text-foreground", saved && "tap-pop")}
            fill={saved ? "currentColor" : "none"}
            strokeWidth={1.8}
          />
        </button>
      </div>

      <div className="space-y-1.5 px-4 pt-3">
        <p className="text-[13px] font-semibold">{likeCount.toLocaleString()} likes</p>
        <p className="text-[13.5px] leading-relaxed">
          <span className="font-semibold">{post.user}</span>{" "}
          <span className="text-foreground/85">{post.caption}</span>
        </p>
        <button
          onClick={() => setComments(true)}
          className="block text-[13px] text-muted-foreground"
        >
          View all {post.comments} comments
        </button>
        <p className="pt-0.5 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          {post.time}
        </p>
      </div>

      {comments && <CommentsSheet post={post} onClose={() => setComments(false)} />}
    </article>
  );
}
