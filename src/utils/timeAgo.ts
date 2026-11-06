const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

export function timeAgo(iso: string, now: number = Date.now()): string {
  const date = new Date(iso);
  const diffSec = Math.trunc((date.getTime() - now) / 1000); // negative = in the past

  if (Number.isNaN(diffSec)) return "";
  if (diffSec > -60) return "just now"; // also covers a slightly-ahead server clock

  // older than a week: show a normal date instead of "23 days ago"
  if (diffSec <= -7 * 86_400) {
    const sameYear = date.getFullYear() === new Date(now).getFullYear();
    return date.toLocaleDateString("en", {
      month: "short",
      day: "numeric",
      ...(sameYear ? {} : { year: "numeric" }),
    });
  }

  for (const [unit, secs] of STEPS) {
    if (Math.abs(diffSec) >= secs) {
      return rtf.format(Math.trunc(diffSec / secs), unit);
    }
  }
  return "just now";
}