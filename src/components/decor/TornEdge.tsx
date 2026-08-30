type TornEdgeProps = {
  position?: "top" | "bottom";
  flip?: boolean;
  className?: string;
};

export default function TornEdge({
  position = "bottom",
  flip = false,
  className,
}: TornEdgeProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative block h-6 w-full overflow-hidden ${
        position === "top" ? "absolute top-0 left-0" : ""
      } ${className ?? ""}`}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      {/* Underlying white fibrous tear shadow */}
      <svg
        viewBox="0 0 1200 28"
        preserveAspectRatio="none"
        className="absolute inset-0 h-6 w-full opacity-60 translate-y-[1px]"
      >
        <path
          d="M0 28 L0 12 L35 18 L70 7 L128 15 L185 5 L238 16 L308 9 L374 19 L438 6 L506 14 L570 8 L635 17 L698 5 L764 15 L827 10 L899 20 L960 7 L1028 13 L1093 6 L1152 16 L1200 10 L1200 28 Z"
          fill="#f6f1e7"
        />
      </svg>
      {/* Primary surface paper tear */}
      <svg
        viewBox="0 0 1200 28"
        preserveAspectRatio="none"
        className="relative h-6 w-full"
      >
        <path
          d="M0 28 L0 14 L38 20 L74 9 L131 17 L189 7 L242 18 L311 11 L377 21 L442 8 L510 16 L574 10 L639 19 L702 7 L768 17 L831 12 L903 22 L964 9 L1032 15 L1097 8 L1156 18 L1200 12 L1200 28 Z"
          fill="#fffcf5"
        />
      </svg>
    </div>
  );
}
