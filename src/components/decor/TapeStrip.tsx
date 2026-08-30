import { cn } from "@/lib/cn";

type TapeStripProps = {
  angle?: number;
  variant?: "masking" | "washi" | "clear";
  className?: string;
};

export default function TapeStrip({
  angle = -4,
  variant = "masking",
  className,
}: TapeStripProps) {
  const variantStyles = {
    masking:
      "bg-[#f2e7c9]/80 shadow-[0_1px_3px_rgba(33,28,21,0.08)] border-t border-b border-[#e5d8b3]/60",
    washi:
      "bg-[#a84b2a]/20 backdrop-blur-[1px] shadow-[0_1px_2px_rgba(33,28,21,0.1)] border-t border-b border-[#a84b2a]/30",
    clear:
      "bg-white/40 backdrop-blur-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.06)] border-t border-b border-white/50",
  };

  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-20 block h-6 w-24 select-none",
        variantStyles[variant],
        className,
      )}
      style={{
        rotate: `${angle}deg`,
        clipPath:
          "polygon(0% 15%, 4% 0%, 12% 10%, 25% 2%, 40% 12%, 58% 2%, 75% 12%, 88% 0%, 96% 10%, 100% 4%, 98% 85%, 92% 100%, 80% 90%, 65% 98%, 48% 88%, 30% 98%, 15% 90%, 2% 100%)",
      }}
    />
  );
}
