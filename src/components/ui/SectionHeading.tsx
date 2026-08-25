import Squiggle from "@/components/decor/Squiggle";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  title: string;
  sub?: string;
  squiggle?: boolean;
  className?: string;
};

export default function SectionHeading({
  title,
  sub,
  squiggle = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {squiggle && <Squiggle className="mt-2" />}
      {sub && <p className="mt-3 max-w-prose text-base text-muted-ink">{sub}</p>}
    </div>
  );
}
