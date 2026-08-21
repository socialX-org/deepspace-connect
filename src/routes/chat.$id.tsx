import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  ChevronLeft,
  Phone,
  Video,
  MoreVertical,
  Camera,
  ImagePlus,
  Mic,
  Send,
  Check,
  CheckCheck,
  Play,
  BellOff,
  Ban,
  Flag,
  Images,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getChat, getThread, type ChatMessage } from "@/lib/messages-data";
import { Sheet } from "@/components/socialx/Sheet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat/$id")({
  component: Chat,
  head: () => ({
    meta: [
      { title: "Chat — SocialX" },
      { name: "description", content: "A private SocialX conversation with photos, Clips and voice notes." },
      { property: "og:title", content: "Chat — SocialX" },
      { property: "og:description", content: "A private SocialX conversation." },
    ],
  }),
});

function Chat() {
  const { id } = Route.useParams();
  const router = useRouter();
  const thread = getThread(id);
  const [blocks, setBlocks] = useState(() => getChat(id).map((b) => ({ ...b, messages: [...b.messages] })));
  const [draft, setDraft] = useState("");
  const [menu, setMenu] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.setAttribute("data-chat-open", "");
    return () => document.body.removeAttribute("data-chat-open");
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [blocks, typing]);

  useEffect(() => {
    if (!recording) return;
    setSeconds(0);
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const push = (m: ChatMessage) =>
    setBlocks((b) => {
      const next = b.map((x) => ({ ...x, messages: [...x.messages] }));
      next[next.length - 1].messages.push(m);
      return next;
    });

  const simulateReply = () => {
    setTimeout(() => setTyping(true), 700);
    setTimeout(() => {
      setTyping(false);
      push({
        id: crypto.randomUUID(),
        from: "them",
        kind: "text",
        text: "Noted 🖤",
        time: nowTime(),
      });
    }, 2600);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    push({ id: crypto.randomUUID(), from: "me", kind: "text", text, time: nowTime(), status: "sent" });
    setDraft("");
    simulateReply();
  };

  const stopRecording = (send: boolean) => {
    const d = seconds;
    setRecording(false);
    if (send && d > 0) {
      push({
        id: crypto.randomUUID(),
        from: "me",
        kind: "voice",
        duration: `0:${String(d).padStart(2, "0")}`,
        time: nowTime(),
        status: "sent",
      });
      simulateReply();
    }
  };

  const status = thread.presence.hidden
    ? null
    : thread.presence.activeNow
      ? "Active now"
      : thread.presence.lastSeen;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-xl items-center gap-2 px-3">
          <button onClick={() => router.history.back()} aria-label="Back" className="pr-0.5">
            <ChevronLeft className="size-6" strokeWidth={1.8} />
          </button>
          <Link
            to="/u/$username"
            params={{ username: thread.user }}
            className="flex min-w-0 flex-1 items-center gap-2.5"
          >
            <div className="relative">
              <img
                src={thread.avatar}
                alt={thread.user}
                width={512}
                height={512}
                className="size-9 rounded-full object-cover"
              />
              {thread.presence.activeNow && !thread.presence.hidden && (
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background bg-crimson" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-[14.5px] font-semibold tracking-tight">
                {thread.name}
              </p>
              {status && (
                <p className="truncate text-[11px] text-foreground/45">{status}</p>
              )}
            </div>
          </Link>
          <button aria-label="Voice call" className="p-1.5">
            <Phone className="size-[20px]" strokeWidth={1.7} />
          </button>
          <button aria-label="Video call" className="p-1.5">
            <Video className="size-[21px]" strokeWidth={1.7} />
          </button>
          <button aria-label="Conversation options" onClick={() => setMenu(true)} className="p-1.5">
            <MoreVertical className="size-[20px]" strokeWidth={1.7} />
          </button>
        </div>
        <div className="h-px w-full bg-[oklch(1_0_0_/_7%)]" />
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-40 pt-4">
        {blocks.map((block) => (
          <section key={block.label}>
            <p className="py-4 text-center text-[11px] uppercase tracking-[0.16em] text-foreground/35">
              {block.label}
            </p>
            <div className="flex flex-col gap-1.5">
              {block.messages.map((m, i) => (
                <Bubble
                  key={m.id}
                  m={m}
                  avatar={thread.avatar}
                  last={i === block.messages.length - 1}
                />
              ))}
            </div>
          </section>
        ))}
        {typing && (
          <div className="reply-in mt-3 flex items-center gap-2">
            <img src={thread.avatar} alt="" className="size-6 rounded-full object-cover" />
            <span className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border px-3 py-2.5">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="typing-dot size-1.5 rounded-full bg-foreground/60"
                  style={{ animationDelay: `${d * 0.16}s` }}
                />
              ))}
            </span>
          </div>
        )}
        <div ref={endRef} />
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 bg-background/95 backdrop-blur-xl">
        <div className="h-px w-full bg-[oklch(1_0_0_/_7%)]" />
        <div className="mx-auto flex max-w-xl items-end gap-2 px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2.5">
          {recording ? (
            <div className="flex h-11 flex-1 items-center gap-3 rounded-2xl border border-crimson/60 px-3.5">
              <span className="rec-pulse size-2.5 rounded-full bg-crimson" />
              <span className="text-[13px] tabular-nums text-foreground">
                0:{String(seconds).padStart(2, "0")}
              </span>
              <span className="flex-1 text-[12.5px] text-foreground/45">Release to send</span>
              <button onClick={() => stopRecording(false)} aria-label="Cancel recording">
                <Trash2 className="size-[18px] text-foreground/70" strokeWidth={1.7} />
              </button>
            </div>
          ) : (
            <>
              <button aria-label="Camera" className="pb-2.5">
                <Camera className="size-[22px]" strokeWidth={1.7} />
              </button>
              <button aria-label="Send photos or video" className="pb-2.5">
                <ImagePlus className="size-[22px]" strokeWidth={1.7} />
              </button>
              <div className="flex min-h-11 flex-1 items-center rounded-2xl border border-border px-3.5">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Message…"
                  aria-label="Message"
                  className="h-11 w-full bg-transparent text-[13.5px] outline-none placeholder:text-foreground/40"
                />
              </div>
            </>
          )}
          {draft.trim() && !recording ? (
            <button onClick={send} aria-label="Send message" className="pb-2.5">
              <Send className="size-[22px] text-crimson" strokeWidth={1.8} />
            </button>
          ) : (
            <button
              aria-label="Hold to record a voice message"
              onPointerDown={() => setRecording(true)}
              onPointerUp={() => stopRecording(true)}
              onPointerLeave={() => recording && stopRecording(true)}
              className="pb-2.5"
            >
              <Mic
                className={cn("size-[22px]", recording ? "text-crimson" : "text-foreground")}
                strokeWidth={1.7}
              />
            </button>
          )}
        </div>
      </div>

      {menu && (
        <Sheet title="Conversation" onClose={() => setMenu(false)}>
          <div className="px-2 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-2">
            {[
              { icon: BellOff, label: "Mute notifications" },
              { icon: Images, label: "View shared media" },
              { icon: Search, label: "Search in conversation" },
              { icon: Ban, label: "Block", danger: true },
              { icon: Flag, label: "Report", danger: true },
            ].map((r) => (
              <button
                key={r.label}
                onClick={() => setMenu(false)}
                className="flex w-full items-center gap-4 rounded-xl px-3 py-3.5 text-left transition-colors active:bg-[oklch(1_0_0_/_5%)]"
              >
                <r.icon
                  className={cn("size-[21px]", r.danger ? "text-crimson" : "text-foreground")}
                  strokeWidth={1.7}
                />
                <span className={cn("text-[14px]", r.danger && "text-crimson")}>{r.label}</span>
              </button>
            ))}
          </div>
        </Sheet>
      )}
    </div>
  );
}

function Bubble({ m, avatar, last }: { m: ChatMessage; avatar: string; last: boolean }) {
  const mine = m.from === "me";
  return (
    <div className={cn("msg-in flex items-end gap-2", mine ? "justify-end" : "justify-start")}>
      {!mine && (
        <img
          src={avatar}
          alt=""
          className={cn("size-6 rounded-full object-cover", !last && "invisible")}
        />
      )}
      <div className={cn("flex max-w-[76%] flex-col", mine ? "items-end" : "items-start")}>
        {m.kind === "text" && (
          <p
            className={cn(
              "rounded-[14px] px-3.5 py-2.5 text-[13.5px] leading-[1.45]",
              mine
                ? "rounded-br-[4px] bg-primary text-primary-foreground"
                : "rounded-bl-[4px] border border-border text-foreground",
            )}
          >
            {m.text}
          </p>
        )}

        {m.kind === "images" && (
          <div className={cn("grid gap-1", m.images!.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
            {m.images!.map((src) => (
              <img
                key={src}
                src={src}
                alt="Shared media"
                loading="lazy"
                className="h-40 w-full rounded-[14px] object-cover"
              />
            ))}
          </div>
        )}

        {m.kind === "voice" && (
          <div
            className={cn(
              "flex items-center gap-3 rounded-[14px] px-3 py-2.5",
              mine
                ? "rounded-br-[4px] bg-primary text-primary-foreground"
                : "rounded-bl-[4px] border border-border",
            )}
          >
            <Play className="size-4 fill-current" strokeWidth={0} />
            <span className="flex items-end gap-[3px]">
              {[6, 12, 8, 16, 10, 14, 7, 13, 9, 15, 6, 11].map((h, i) => (
                <span
                  key={i}
                  style={{ height: h }}
                  className={cn(
                    "w-[2px] rounded-full",
                    mine ? "bg-primary-foreground/70" : "bg-foreground/55",
                  )}
                />
              ))}
            </span>
            <span className="text-[11.5px] tabular-nums opacity-70">{m.duration}</span>
          </div>
        )}

        {m.reaction && (
          <span className="-mt-1.5 rounded-full border border-border bg-background px-1.5 text-[11px]">
            {m.reaction}
          </span>
        )}

        {mine && last && (
          <span className="mt-1 flex items-center gap-1 text-[10.5px] text-foreground/40">
            {m.time}
            {m.status === "sent" && <Check className="size-3" strokeWidth={2} />}
            {m.status === "delivered" && <CheckCheck className="size-3" strokeWidth={2} />}
            {m.status === "seen" && <CheckCheck className="size-3 text-crimson" strokeWidth={2} />}
          </span>
        )}
      </div>
    </div>
  );
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
