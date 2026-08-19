import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Plus, Clapperboard, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        if (y < 48) setHidden(false);
        else if (delta > 6) setHidden(true);
        else if (delta < -6) setHidden(false);
        lastY.current = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/discover", label: "Discover", icon: Search },
  { to: "/create", label: "Create", icon: Plus, create: true },
  { to: "/clips", label: "Clips", icon: Clapperboard },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const hidden = useHideOnScroll();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 bg-background transition-transform duration-300 ease-out",
        hidden ? "translate-y-full" : "translate-y-0",
      )}
    >
      <div className="h-px w-full bg-border" />
      <ul className="mx-auto flex max-w-xl items-center justify-between px-6 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-3">
        {items.map(({ to, label, icon: Icon, ...rest }) => {
          const active = path === to;
          const isCreate = "create" in rest && rest.create;
          return (
            <li key={to}>
              <Link
                to={to}
                aria-label={label}
                className="flex flex-col items-center gap-1 outline-none"
              >
                <Icon
                  className={cn(
                    "size-[26px] transition-opacity",
                    active ? "text-foreground opacity-100" : "text-foreground opacity-45",
                  )}
                  strokeWidth={active ? 2.2 : 1.7}
                  fill={!isCreate && active && (label === "Home" || label === "Profile") ? "currentColor" : "none"}
                />}
                <span
                  className={cn(
                    "h-1 w-1 rounded-full",
                    active && !isCreate ? "bg-foreground" : "bg-transparent",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
