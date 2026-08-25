type TapeStripProps = {
  angle?: number;
  className?: string;
};

export default function TapeStrip({ angle = -4, className }: TapeStripProps) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 block h-6 w-24 bg-[#e8ddc4]/70 shadow-sm ${className ?? ""}`}
      style={{
        rotate: `${angle}deg`,
        clipPath:
          "polygon(2% 12%, 8% 0%, 22% 10%, 38% 2%, 55% 12%, 72% 0%, 88% 10%, 98% 4%, 100% 88%, 92% 100%, 74% 90%, 56% 98%, 40% 88%, 24% 100%, 9% 92%, 0% 80%)",
      }}
    />
  );
}
