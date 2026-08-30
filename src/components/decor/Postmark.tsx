import { cn } from "@/lib/cn";

type PostmarkProps = {
  text?: string;
  className?: string;
  rotate?: number;
};

export default function Postmark({
  text = "LUMINA POST • 1924",
  className,
  rotate = -12,
}: PostmarkProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none text-muted-ink/40 flex items-center gap-2 font-display text-[10px] tracking-widest uppercase",
        className,
      )}
      style={{ rotate: `${rotate}deg` }}
    >
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-current p-1 text-center text-[8px] leading-tight">
        <span>{text}</span>
      </div>
      <svg className="h-6 w-16 stroke-current" viewBox="0 0 60 20" fill="none">
        <path
          d="M0 4 Q 15 0, 30 4 T 60 4 M0 10 Q 15 6, 30 10 T 60 10 M0 16 Q 15 12, 30 16 T 60 16"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
