import { Search } from "lucide-react";

export function FollowSearch({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative px-4 py-3">
      <Search
        className="pointer-events-none absolute left-7 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
        strokeWidth={1.8}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border-0 bg-input py-2.5 pl-10 pr-4 text-[13.5px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}
