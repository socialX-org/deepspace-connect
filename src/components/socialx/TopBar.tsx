import { Link } from "@tanstack/react-router";
import { Heart, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function SocialXLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-[22px] font-semibold tracking-[-0.03em] text-foreground",
        className,
      )}
    >
      Social
      <span className="bg-crimson-gradient bg-clip-text text-transparent">X</span>
    </span>
  );
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-4">
        <SocialXLogo />
        <div className="flex items-center gap-5">
          <Link to="/notifications" aria-label="Notifications" className="relative">
            <Heart className="size-[25px] text-foreground" strokeWidth={1.7} />
            <span className="bg-crimson-gradient absolute -right-1 -top-0.5 flex min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-[16px] text-foreground">
              4
            </span>
          </Link>
          <Link to="/messages" aria-label="Messages" className="relative">
            <Send className="size-[24px] text-foreground" strokeWidth={1.7} />
            <span className="bg-crimson-gradient absolute -right-1.5 -top-0.5 flex min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-[16px] text-foreground">
              2
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function PageBar({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-4">
        <h1 className="font-display text-[17px] font-semibold tracking-tight">{title}</h1>
        {right}
      </div>
      <div className="h-px w-full bg-border" />
    </header>
  );
}
