type AuthCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-sm backdrop-blur-md">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-7">{children}</div>
    </div>
  );
}
