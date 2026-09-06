import { Link } from "@tanstack/react-router";
import { formatCompactNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function FollowTabs({
  followersCount,
  followingCount,
  active,
}: {
  followersCount: number;
  followingCount: number;
  active: "followers" | "following";
}) {
  const tabs = [
    { id: "followers" as const, label: "Followers", count: followersCount, to: "/followers" },
    { id: "following" as const, label: "Following", count: followingCount, to: "/following" },
  ];

  return (
    <div className="flex border-b border-border">
      {tabs.map(({ id, label, count, to }) => {
        const isActive = active === id;
        return (
          <Link
            key={id}
            to={to}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 py-3 text-[13.5px] font-semibold transition-colors",
              isActive
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground"
            )}
          >
            <span>{formatCompactNumber(count)}</span>
            <span className="font-medium opacity-80">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
