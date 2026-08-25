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
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 28"
      preserveAspectRatio="none"
      className={`pointer-events-none block h-6 w-full ${
        position === "top" ? "absolute top-0 left-0" : ""
      } ${className ?? ""}`}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <path
        d="M0 28 L0 14 L38 20 L74 9 L131 17 L189 7 L242 18 L311 11 L377 21 L442 8 L510 16 L574 10 L639 19 L702 7 L768 17 L831 12 L903 22 L964 9 L1032 15 L1097 8 L1156 18 L1200 12 L1200 28 Z"
        fill="#fffcf5"
      />
    </svg>
  );
}
