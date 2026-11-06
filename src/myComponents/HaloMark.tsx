import { useId } from "react";

export function HaloMark({ className = "size-9" }: { className?: string }) {
  // useId returns something like ":r1:", and colons are awkward inside url(#…)
  const id = `halo-${useId().replace(/:/g, "")}`;

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--halo-1)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--halo-2)" }} />
          <stop offset="1" style={{ stopColor: "var(--halo-3)" }} />
        </linearGradient>
      </defs>
      <circle cx="30" cy="34" r="19" fill="none" stroke={`url(#${id})`} strokeWidth="7" />
      <circle cx="50" cy="14" r="6" fill={`url(#${id})`} />
    </svg>
  );
}

export function HaloLogo() {
  return (
    <span className="flex items-center gap-2.5">
      <HaloMark className="size-9" />
      <span className="font-display text-[22px] font-bold text-fg">Halo</span>
    </span>
  );
}