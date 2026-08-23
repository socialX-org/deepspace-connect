import { Check, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { countries, type Country } from "@/lib/countries";

export function CountryPicker({
  value,
  onSelect,
  onClose,
}: {
  value: Country;
  onSelect: (c: Country) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const list = useMemo(
    () =>
      term
        ? countries.filter(
            (c) =>
              c.name.toLowerCase().includes(term) ||
              c.dial.includes(term) ||
              c.code.toLowerCase() === term,
          )
        : countries,
    [term],
  );

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="sheet-rise mx-auto flex h-[100dvh] w-full max-w-md flex-col">
        <div className="flex h-14 items-center justify-between px-5">
          <h2 className="font-display text-[17px] font-semibold">Select country</h2>
          <button
            onClick={onClose}
            aria-label="Close country picker"
            className="-mr-2 flex size-10 items-center justify-center rounded-full active:scale-90"
          >
            <X className="size-5" strokeWidth={1.6} />
          </button>
        </div>

        <div className="px-5 pb-3">
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-[oklch(1_0_0_/_16%)] px-4">
            <Search className="size-4 text-[oklch(1_0_0_/_50%)]" strokeWidth={1.8} />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search country or code"
              className="h-full flex-1 bg-transparent text-[15px] outline-none placeholder:text-[oklch(1_0_0_/_38%)]"
            />
          </div>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-2 pb-8">
          {list.length === 0 && (
            <p className="px-5 py-10 text-center text-[14px] text-[oklch(1_0_0_/_45%)]">
              No country matches “{q}”.
            </p>
          )}
          {list.map((c) => {
            const active = c.code === value.code;
            return (
              <button
                key={c.code}
                onClick={() => {
                  onSelect(c);
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors active:bg-[oklch(1_0_0_/_6%)]"
              >
                <span className="text-[22px] leading-none">{c.flag}</span>
                <span className="flex-1 text-[15px]">{c.name}</span>
                <span className="text-[14px] text-[oklch(1_0_0_/_52%)]">{c.dial}</span>
                {active && (
                  <Check className="size-4" strokeWidth={2} style={{ color: "oklch(0.58 0.2 25)" }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
