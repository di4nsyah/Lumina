import { cn } from "@/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...rest }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-hairline bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted-ink/60 focus:border-accent/50",
        className,
      )}
      {...rest}
    />
  );
}
