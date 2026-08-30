import { cn } from "@/lib/cn";

type StampBadgeProps = {
  children: React.ReactNode;
  tone?: "rust" | "moss" | "paper";
  rotate?: number;
  className?: string;
};

export default function StampBadge({
  children,
  tone = "rust",
  rotate = -2,
  className,
}: StampBadgeProps) {
  const toneStyles = {
    rust: "border-accent/50 bg-accent/10 text-accent",
    moss: "border-emerald-800/40 bg-emerald-900/10 text-emerald-900",
    paper: "border-hairline bg-surface text-muted-ink",
  };

  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-1.5 border border-dashed px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-transform hover:scale-105",
        toneStyles[tone],
        className,
      )}
      style={{ rotate: `${rotate}deg` }}
    >
      <span className="pointer-events-none absolute -left-1 -top-1 h-1.5 w-1.5 rounded-full border border-hairline bg-paper" />
      <span className="pointer-events-none absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full border border-hairline bg-paper" />
      <span className="pointer-events-none absolute -bottom-1 -left-1 h-1.5 w-1.5 rounded-full border border-hairline bg-paper" />
      <span className="pointer-events-none absolute -bottom-1 -right-1 h-1.5 w-1.5 rounded-full border border-hairline bg-paper" />
      {children}
    </span>
  );
}
