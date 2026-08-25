import TapeStrip from "@/components/decor/TapeStrip";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="relative rounded-sm border border-hairline bg-surface p-8 shadow-sm">
      <TapeStrip angle={-45} className="-left-10 -top-5" />
      <TapeStrip angle={45} className="-right-10 -top-5" />

      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
        {title}
      </h1>
      <p className="mt-1.5 text-sm text-muted-ink">{subtitle}</p>
      <div className="mt-7">{children}</div>
    </div>
  );
}
