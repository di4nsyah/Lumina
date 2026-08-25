import { cn } from "@/lib/cn";

type StampBadgeProps = {
  children: React.ReactNode;
  tone?: "rust" | "moss";
  rotate?: number;
  className?: string;
};

export default function StampBadge({
  children,
  tone = "rust",
  rotate = -2,
  className,
}: StampBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        tone === "rust"
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-emerald-700/30 bg-emerald-800/10 text-emerald-800",
        className,
      )}
      style={{ rotate: `${rotate}deg` }}
    >
      {children}
    </span>
  );
}
