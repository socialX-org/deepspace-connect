import { Plus } from "lucide-react";
import { useState } from "react";
import { stories, type Story } from "@/lib/socialx-data";
import { StoryViewer } from "./StoryViewer";
import { cn } from "@/lib/utils";

function StoryAvatar({ story, onOpen }: { story: Story; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="flex w-[92px] shrink-0 flex-col items-center gap-1.5">
      <span className="relative block">
        <span
          className={cn(
            "block rounded-full p-[3.5px]",
            story.seen && !story.isYou ? "story-ring-seen" : "story-ring",
          )}
        >
          <span className="block rounded-full bg-background p-[2.5px]">
            <img
              src={story.avatar}
              alt={story.name}
              width={512}
              height={512}
              loading="lazy"
              className="size-[80px] rounded-full object-cover"
            />
          </span>
        </span>
        {story.isYou && (
          <span className="bg-crimson-gradient absolute bottom-0.5 right-0.5 flex size-[22px] items-center justify-center rounded-full ring-2 ring-background">
            <Plus className="size-3 text-foreground" strokeWidth={3} />
          </span>
        )}
      </span>
      <span className="max-w-[86px] truncate text-[11px] text-foreground/70">{story.name}</span>
    </button>
  );
}

export function StoryTray() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <div className="no-scrollbar overflow-x-auto">
        <div className="mx-auto flex max-w-xl gap-3.5 px-4 pb-3 pt-1">
          {stories.map((s, i) => (
            <StoryAvatar key={s.id} story={s} onOpen={() => setOpen(i)} />
          ))}
        </div>
      </div>
      {open !== null && <StoryViewer index={open} onClose={() => setOpen(null)} />}
    </>
  );
}
