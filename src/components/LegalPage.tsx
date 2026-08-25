import Wordmark from "@/components/ui/Wordmark";
import SiteFooter from "@/components/SiteFooter";

type LegalPageProps = {
  title: string;
  updated?: string;
  children: React.ReactNode;
};

export default function LegalPage({
  title,
  updated = "August 2026",
  children,
}: LegalPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink antialiased">
      <header className="border-b border-hairline">
        <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6">
          <Wordmark />
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-14 sm:px-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="mt-2 text-xs uppercase tracking-wide text-muted-ink/70">
          Last updated {updated}
        </p>
        <div className="mt-10 space-y-5 font-display text-[17px] font-light leading-relaxed [&_a]:font-normal [&_a]:text-accent [&_a]:underline-offset-4 [&_a:hover]:underline [&_h2]:mb-1 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:mb-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_strong]:font-semibold">
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
