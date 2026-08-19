import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { stories, exploreGrid } from "@/lib/socialx-data";

export function StoryViewer({ index, onClose }: { index: number; onClose: () => void }) {
  const [current, setCurrent] = useState(index);
  const [progress, setProgress] = useState(0);
  const story = stories[current];

  useEffect(() => {
    setProgress(0);
    const started = Date.now();
    const id = setInterval(() => {
      const p = Math.min((Date.now() - started) / 5000, 1);
      setProgress(p);
      if (p >= 1) {
        clearInterval(id);
        if (current < stories.length - 1) setCurrent((c) => c + 1);
        else onClose();
      }
    }, 40);
    return () => clearInterval(id);
  }, [current, onClose]);

  return (
    <div className="fixed inset-0 z-[70] bg-background">
      <div className="mx-auto flex h-full max-w-xl flex-col">
        <div className="flex gap-1 px-3 pt-3">
          {stories.map((_, i) => (
            <span key={i} className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/20">
              <span
                className="block h-full bg-foreground"
                style={{ width: i < current ? "100%" : i === current ? `${progress * 100}%` : 0 }}
              />
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <img
              src={story.avatar}
              alt={story.name}
              width={512}
              height={512}
              className="size-8 rounded-full object-cover"
            />
            <span className="text-sm font-semibold">{story.name}</span>
            <span className="text-xs text-muted-foreground">3h</span>
          </div>
          <button onClick={onClose} aria-label="Close story">
            <X className="size-6" strokeWidth={1.8} />
          </button>
        </div>
        <div className="flex flex-1 items-center">
          <img
            src={exploreGrid[current % exploreGrid.length]}
            alt=""
            className="max-h-full w-full object-cover"
          />
        </div>
        <div className="px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3">
          <div className="flex h-11 items-center rounded-full border border-border px-4 text-sm text-muted-foreground">
            Reply to {story.name}…
          </div>
        </div>
      </div>
    </div>
  );
}
