import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function FollowTopBar({ username }: { username: string }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 bg-background/95 px-4 backdrop-blur-xl">
      <Link to="/profile" aria-label="Back">
        <ArrowLeft className="size-[22px]" strokeWidth={1.8} />
      </Link>
      <h1 className="font-display text-[17px] font-semibold tracking-tight">
        @{username}
      </h1>
    </header>
  );
}
