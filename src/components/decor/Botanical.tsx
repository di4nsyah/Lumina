import { cn } from "@/lib/cn";

type BotanicalProps = {
  variant?: "sprig" | "branch";
  className?: string;
};

export default function Botanical({
  variant = "sprig",
  className,
}: BotanicalProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 160"
      fill="none"
      className={cn("pointer-events-none select-none text-ink opacity-25", className)}
    >
      {variant === "sprig" ? (
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M60 155 C 58 110, 62 70, 60 18" />
          <path d="M60 120 C 40 112, 28 96, 26 78 C 44 84, 56 98, 60 120 Z" />
          <path d="M61 92 C 80 86, 92 72, 94 54 C 76 60, 64 74, 61 92 Z" />
          <path d="M60 58 C 46 50, 38 38, 37 24 C 51 30, 59 42, 60 58 Z" />
        </g>
      ) : (
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10 150 C 45 130, 85 95, 108 30" />
          <path d="M52 118 C 68 116, 82 106, 88 92 C 70 92, 57 102, 52 118 Z" />
          <path d="M78 84 C 62 78, 52 66, 50 50 C 66 56, 76 68, 78 84 Z" />
          <path d="M96 52 C 110 48, 118 38, 120 24 C 106 28, 98 38, 96 52 Z" />
        </g>
      )}
    </svg>
  );
}
