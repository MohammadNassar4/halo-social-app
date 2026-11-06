

export default function Spinner() {
  return (
    <div className="h-20 flex justify-center items-center animate-spin">
      <svg height="100%" viewBox="0 0 32 32" width="30" className="text-accent">
        <circle
          cx={16}
          cy={16}
          fill="none"
          r={14}
          strokeWidth={4}
          style={{ stroke: 'currentColor', opacity: "0.2" }}
        />
        <circle
          cx={16}
          cy={16}
          fill="none"
          r={14}
          strokeWidth={4}
          style={{
            stroke: "currentColor",
            strokeDasharray: 80,
            strokeDashoffset: 60
          }}
        />
      </svg>
    </div>
  );
}