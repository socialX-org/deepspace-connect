import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Sheet({
  title,
  onClose,
  children,
  className,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="sheet-fade fixed inset-0 z-[60] flex flex-col justify-end bg-black/70 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={title}
        className={cn(
          "sheet-rise mx-auto flex w-full max-w-xl flex-col rounded-t-3xl border-t border-border bg-background",
          className,
        )}
      >
        <div className="flex justify-center pt-2.5">
          <span className="h-1 w-9 rounded-full bg-[oklch(1_0_0_/_18%)]" />
        </div>
        <div className="flex items-center justify-between px-4 pb-3 pt-3">
          <span className="w-6" />
          <h2 className="font-display text-[15px] font-semibold tracking-tight">{title}</h2>
          <button onClick={onClose} aria-label={`Close ${title.toLowerCase()}`}>
            <X className="size-5" strokeWidth={1.8} />
          </button>
        </div>
        <div className="h-px w-full bg-[oklch(1_0_0_/_7%)]" />
        {children}
      </div>
    </div>
  );
}
