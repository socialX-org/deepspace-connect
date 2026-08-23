import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export const TOTAL_STEPS = 9;

export function AuthShell({
  step,
  eyebrow,
  title,
  description,
  children,
  footer,
  onBack,
}: {
  step?: number;
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
}) {
  const router = useRouter();
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-md items-center px-5">
          <button
            type="button"
            onClick={() => (onBack ? onBack() : router.history.back())}
            aria-label="Go back"
            className="-ml-2 flex size-10 items-center justify-center rounded-full transition-transform active:scale-90"
          >
            <ChevronLeft className="size-6" strokeWidth={1.6} />
          </button>
        </div>
        {typeof step === "number" && (
          <div className="mx-auto w-full max-w-md px-5 pb-4">
            <div className="h-px w-full bg-[oklch(1_0_0_/_10%)]">
              <div
                className="h-px bg-foreground transition-[width] duration-500 ease-out"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>
        )}
      </header>

      <main className="page-in mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-6">
        <div className="pt-4">
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[oklch(1_0_0_/_45%)]">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display mt-3 text-[28px] font-semibold leading-[1.15] tracking-[-0.02em]">
            {title}
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-[oklch(1_0_0_/_58%)]">
            {description}
          </p>
        </div>

        <div className="mt-8 flex-1">{children}</div>

        {footer && (
          <div className="sticky bottom-0 -mx-5 bg-gradient-to-t from-background via-background to-transparent px-5 pb-[max(env(safe-area-inset-bottom),1rem)] pt-4">
            {footer}
          </div>
        )}
      </main>
    </div>
  );
}
