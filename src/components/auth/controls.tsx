import { Loader2 } from "lucide-react";
import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PrimaryButton({
  children,
  loading,
  className,
  ...props
}: { loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={cn(
        "flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-foreground text-[15px] font-semibold tracking-[-0.01em] text-background",
        "transition-all duration-200 active:scale-[0.985] disabled:bg-[oklch(1_0_0_/_14%)] disabled:text-[oklch(1_0_0_/_38%)]",
        className,
      )}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "flex h-[52px] w-full items-center justify-center rounded-full border border-[oklch(1_0_0_/_20%)] bg-background text-[15px] font-semibold text-foreground transition-all duration-200 active:scale-[0.985] active:border-[oklch(0.44_0.18_24_/_80%)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  error,
  prefix,
  suffix,
  className,
  ...props
}: {
  label: string;
  hint?: ReactNode;
  error?: string | null;
  prefix?: ReactNode;
  suffix?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const filled = String(props.value ?? "").length > 0;

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative flex items-center rounded-2xl border bg-background px-4 transition-colors duration-200",
          error
            ? "border-[oklch(0.44_0.18_24)]"
            : focused
              ? "border-[oklch(1_0_0_/_55%)]"
              : "border-[oklch(1_0_0_/_16%)]",
        )}
      >
        {prefix}
        <div className="relative flex-1">
          <label
            htmlFor={id}
            className={cn(
              "pointer-events-none absolute left-0 origin-left text-[oklch(1_0_0_/_50%)] transition-all duration-200",
              focused || filled
                ? "top-[10px] text-[11px] tracking-[0.14em] uppercase"
                : "top-1/2 -translate-y-1/2 text-[15px]",
            )}
          >
            {label}
          </label>
          <input
            id={id}
            {...props}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "h-[64px] w-full bg-transparent pt-5 text-[16px] text-foreground outline-none placeholder:text-transparent",
              className,
            )}
          />
        </div>
        {suffix}
      </div>
      {(error || hint) && (
        <p
          className={cn(
            "mt-2 px-1 text-[12.5px]",
            error ? "text-[oklch(0.58_0.2_25)]" : "text-[oklch(1_0_0_/_48%)]",
          )}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
