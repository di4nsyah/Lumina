import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "quiet";
};

const VARIANTS = {
  primary: "bg-ink text-surface hover:bg-ink/85",
  outline: "border border-ink/30 text-ink hover:border-ink",
  quiet: "text-accent underline-offset-4 hover:underline",
} as const;

export default function Button({
  variant = "primary",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        className,
      )}
      {...rest}
    />
  );
}
