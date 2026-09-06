import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) {
    const value = n / 1_000_000;
    return (
      value.toFixed(value >= 10 ? 0 : 1).replace(/\.0$/, "") + "M"
    );
  }
  if (n >= 1_000) {
    const value = n / 1_000;
    return (
      value.toFixed(value >= 10 ? 0 : 1).replace(/\.0$/, "") + "K"
    );
  }
  return n.toString();
}
