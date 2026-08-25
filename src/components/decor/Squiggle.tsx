import { cn } from "@/lib/cn";

type SquiggleProps = {
  className?: string;
};

export default function Squiggle({ className }: SquiggleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 104 12"
      fill="none"
      className={cn("block h-3 w-24 text-accent", className)}
    >
      <path
        d="M2 7 Q 12 2, 22 7 T 42 7 T 62 7 T 82 7 T 102 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
