import { Heart, CornerDownRight } from "lucide-react";
import { useRef, useState } from "react";
import { comments as seed, profile, type Comment, type Post } from "@/lib/socialx-data";
import { Sheet } from "./Sheet";
import { cn } from "@/lib/utils";

function CommentRow({
  comment,
  isReply,
  onReply,
}: {
  comment: Comment;
  isReply?: boolean;
  onReply: (user: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [options, setOptions] = useState(false);
  const press = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPress = () => {
    press.current = setTimeout(() => setOptions(true), 500);
  };
  const endPress = () => {
    if (press.current) clearTimeout(press.current);
  };

  const likes = comment.likes + (liked ? 1 : 0);

  return (
    <div
      className="flex gap-3 rounded-xl px-1 py-1 transition-colors active:bg-[oklch(1_0_0_/_4%)]"
      onPointerDown={startPress}
      onPointerUp={endPress}
      onPointerLeave={endPress}
      onContextMenu={(e) => {
        e.preventDefault();
        setOptions(true);
      }}
    >
      <img
        src={comment.avatar}
        alt={comment.user}
        width={512}
        height={512}
        loading="lazy"
        className={cn("shrink-0 rounded-full object-cover", isReply ? "size-7" : "size-9")}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] leading-relaxed">
          <span className="font-semibold">{comment.user}</span>{" "}
          <span className="text-foreground/85">
            {comment.text.split(/(@[\w.]+)/g).map((part, i) =>
              part.startsWith("@") ? (
                <span key={i} className="font-medium text-foreground">
                  {part}
                </span>
              ) : (
                part
              ),
            )}
          </span>
        </p>
        <div className="mt-1 flex items-center gap-4 text-[11px] text-muted-foreground">
          <span>{comment.time}</span>
          {likes > 0 && <span>{likes} likes</span>}
          <button onClick={() => onReply(comment.user)} className="font-medium">
            Reply
          </button>
        </div>
        {options && (
          <div className="mt-2 flex gap-2 text-[11.5px]">
            {["Reply", "Copy text", "Mention"].map((o) => (
              <button
                key={o}
                onClick={() => setOptions(false)}
                className="rounded-full border border-border px-3 py-1"
              >
                {o}
              </button>
            ))}
            <button onClick={() => setOptions(false)} className="text-crimson px-2 font-semibold">
              Report
            </button>
          </div>
        )}
      </div>
      <button
        onClick={() => setLiked((l) => !l)}
        aria-label="Like comment"
        aria-pressed={liked}
        className="self-start pt-1"
      >
        <Heart
          className={cn("size-4", liked ? "text-crimson tap-pop" : "text-foreground/60")}
          fill={liked ? "currentColor" : "none"}
          strokeWidth={1.8}
        />
      </button>
    </div>
  );
}

function CommentThread({ comment, onReply }: { comment: Comment; onReply: (u: string) => void }) {
  const [open, setOpen] = useState(false);
  const replies = comment.replies ?? [];

  return (
    <div className="space-y-2">
      <CommentRow comment={comment} onReply={onReply} />
      {replies.length > 0 && (
        <div className="pl-12">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 text-[11.5px] text-muted-foreground"
          >
            <span className="h-px w-6 bg-[oklch(1_0_0_/_14%)]" />
            {open ? "Hide replies" : `View ${replies.length} replies`}
            {!open && <CornerDownRight className="size-3" />}
          </button>
          {open && (
            <div className="reply-in mt-3 space-y-4">
              {replies.map((r) => (
                <CommentRow key={r.id} comment={r} isReply onReply={onReply} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CommentsSheet({ post, onClose }: { post: Post; onClose: () => void }) {
  const [value, setValue] = useState("");
  const [list, setList] = useState<Comment[]>(seed);
  const inputRef = useRef<HTMLInputElement>(null);

  const reply = (user: string) => {
    setValue(`@${user} `);
    inputRef.current?.focus();
  };

  const submit = () => {
    const text = value.trim();
    if (!text) return;
    setList((l) => [
      ...l,
      { id: String(Date.now()), user: profile.user, avatar: profile.avatar, text, time: "now", likes: 0 },
    ]);
    setValue("");
  };

  return (
    <Sheet title="Comments" onClose={onClose} className="h-[88vh]">
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
        {list.map((c) => (
          <CommentThread key={c.id} comment={c} onReply={reply} />
        ))}
        <p className="pt-2 text-center text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
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
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Add a comment…"
          className="h-10 flex-1 rounded-full border border-border bg-transparent px-4 text-[13.5px] outline-none placeholder:text-muted-foreground focus:border-white/25"
        />
        <button
          onClick={submit}
          disabled={!value.trim()}
          className={cn(
            "text-[13.5px] font-semibold transition-opacity",
            value.trim() ? "text-crimson" : "text-muted-foreground opacity-60",
          )}
        >
          Post
        </button>
      </div>
    </Sheet>
  );
}
