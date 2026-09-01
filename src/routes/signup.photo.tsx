import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, ImagePlus, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { PrimaryButton } from "@/components/auth/controls";
import { useSignup } from "@/lib/signup-store";

export const Route = createFileRoute("/signup/photo")({
  component: PhotoStep,
  head: () => ({
    meta: [
      { title: "Add a profile picture — SocialX" },
      { name: "description", content: "Add an optional profile picture so people recognise you on SocialX." },
      { property: "og:title", content: "Add a profile picture — SocialX" },
      { property: "og:description", content: "Optional: add a picture people will recognise." },
    ],
  }),
});

function PhotoStep() {
  const navigate = useNavigate();
  const { data, set } = useSignup();
  const fileRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState<string | null>(data.photo);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const next = () => navigate({ to: "/signup/profile" });

  const pick = (f?: File) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSrc(String(reader.result));
      setZoom(1);
      setPos({ x: 0, y: 0 });
    };
    reader.readAsDataURL(f);
  };

  const confirm = () => {
    setSaving(true);
    set({ photo: src });
    setTimeout(next, 600);
  };

  return (
    <AuthShell
      step={7}
      eyebrow="Step 7 of 9 · Optional"
      title="Add profile picture"
      description="A picture helps friends recognise you across the feed, stories and Clips. You can always add one later."
      footer={
        <>
          <PrimaryButton onClick={src ? confirm : () => fileRef.current?.click()} loading={saving}>
            {src ? "Use this picture" : "Add profile picture"}
          </PrimaryButton>
          <button
            type="button"
            onClick={next}
            className="mt-4 w-full text-center text-[13.5px] font-semibold text-[oklch(1_0_0_/_55%)] active:text-foreground"
          >
            Skip for now
          </button>
        </>
      }
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />

      <div className="flex flex-col items-center">
        <div
          className="relative size-[232px] overflow-hidden rounded-full"
          style={{ boxShadow: "0 0 0 1px oklch(1 0 0 / 16%)" }}
          onPointerDown={(e) => {
            if (!src) return;
            drag.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            setPos({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y });
          }}
          onPointerUp={() => (drag.current = null)}
        >
          {src ? (
            <img
              src={src}
              alt="Profile picture preview"
              draggable={false}
              className="size-full select-none object-cover"
              style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})` }}
            />
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex size-full flex-col items-center justify-center gap-3 rounded-full border border-dashed border-[oklch(1_0_0_/_20%)] transition-colors active:bg-[oklch(1_0_0_/_5%)]"
            >
              <Camera className="size-7 text-[oklch(1_0_0_/_65%)]" strokeWidth={1.5} />
              <span className="text-[13px] text-[oklch(1_0_0_/_50%)]">Choose a photo</span>
            </button>
          )}
        </div>

        {src ? (
          <div className="mt-8 w-full">
            <p className="mb-3 text-center text-[12.5px] text-[oklch(1_0_0_/_48%)]">
              Drag to reposition · pinch or slide to zoom
            </p>
            <input
              type="range"
              min={1}
              max={2.5}
              step={0.01}
              value={zoom}
              aria-label="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="crop-range w-full"
            />
            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[oklch(1_0_0_/_18%)] text-[13.5px] font-semibold active:bg-[oklch(1_0_0_/_6%)]"
              >
                <ImagePlus className="size-4" strokeWidth={1.8} /> Change
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setPos({ x: 0, y: 0 });
                }}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[oklch(1_0_0_/_18%)] text-[13.5px] font-semibold active:bg-[oklch(1_0_0_/_6%)]"
              >
                <RotateCcw className="size-4" strokeWidth={1.8} /> Reset
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-8 max-w-[17rem] text-center text-[13px] leading-relaxed text-[oklch(1_0_0_/_45%)]">
            Square photos work best. You'll be able to crop and reposition before saving.
          </p>
        )}
      </div>
    </AuthShell>
  );
}
