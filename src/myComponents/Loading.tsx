

export default function Loading() {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 bg-bg z-50 h-screen flex justify-center items-center">
      <svg
        data-dc-tpl={7}
        width={100}
        height={100}
        viewBox="0 0 64 64"
        role="img"
        aria-label="Halo logo"
        className="animate-ping"
      >
        <defs data-dc-tpl={8}>
          <linearGradient
            data-dc-tpl={9}
            id="hfd"
            x1={0}
            y1={0}
            x2={1}
            y2={1}
          >
            <stop data-dc-tpl={10} offset={0} stopColor="#7C3AED" />
            <stop data-dc-tpl={11} offset="0.55" stopColor="#06B6D4" />
            <stop data-dc-tpl={12} offset={1} stopColor="#34D399" />
          </linearGradient>
        </defs>
        <circle
          data-dc-tpl={13}
          cx={30}
          cy={34}
          r={19}
          fill="none"
          stroke="url(#hfd)"
          strokeWidth={7}
        />
        <circle
          data-dc-tpl={14}
          cx={50}
          cy={14}
          r={6}
          fill="url(#hfd)"
        />
      </svg>
    </div>
  );
}