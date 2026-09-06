import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FollowAccount } from "@/lib/socialx-data";

export function AccountRow({
  account,
  variant = "follow",
}: {
  account: FollowAccount;
  variant?: "follow" | "followBack";
}) {
  const [following, setFollowing] = useState(account.isFollowing ?? false);

  const label = following
    ? "Following"
    : variant === "followBack"
      ? "Follow back"
      : "Follow";

  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <img
        src={account.avatar}
        alt={account.name}
        className="size-12 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-semibold">{account.user}</p>
        <p className="truncate text-[12.5px] text-muted-foreground">
          {account.name}
        </p>
      </div>
      <button
        onClick={() => setFollowing((f) => !f)}
        className={cn(
          "shrink-0 rounded-lg border px-4 py-1.5 text-[12.5px] font-semibold transition-colors duration-200 active:border-crimson active:text-crimson",
          following
            ? "border-border bg-background text-foreground/60"
            : "border-foreground/80 bg-background text-foreground"
        )}
      >
        {label}
      </button>
    </div>
  );
}
