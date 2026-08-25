import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getReadingStats } from "@/lib/bookService";
import SiteHeader, { type SiteHeaderUser } from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionHeading from "@/components/ui/SectionHeading";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Reveal from "@/components/decor/Reveal";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard",
};

function StatStub({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="relative border border-hairline bg-surface px-6 py-7 text-center shadow-sm">
      {/* ticket notches */}
      <span
        aria-hidden="true"
        className="absolute -left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-paper"
      />
      <span
        aria-hidden="true"
        className="absolute -right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-paper"
      />
      <p className="font-display text-4xl font-semibold text-ink">{value}</p>
      <p className="mt-1.5 text-xs font-medium uppercase tracking-wide text-muted-ink">
        {label}
      </p>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/dashboard");
  }
  const siteUser: SiteHeaderUser = user ? { email: user.email ?? "" } : null;

  const stats = await getReadingStats(supabase, user.id);
  const hasActivity =
    stats.savedCount > 0 || stats.ratedCount > 0 || stats.topGenres.length > 0;

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <SiteHeader user={siteUser} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading title="Your reading, on paper" squiggle={hasActivity} />
        </Reveal>

        {!hasActivity ? (
          <div className="mt-10">
            <EmptyState
              title="The ledger is blank"
              body="Save a book or leave a rating and your reading habits will show up here."
              action={
                <Link href="/search">
                  <Button variant="primary">
                    Start reading
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
              <Reveal>
                <StatStub value={String(stats.savedCount)} label="Books saved" />
              </Reveal>
              <Reveal delay={80}>
                <StatStub value={String(stats.ratedCount)} label="Ratings given" />
              </Reveal>
              <Reveal delay={160}>
                <StatStub
                  value={stats.avgGiven !== null ? stats.avgGiven.toFixed(1) : "—"}
                  label="Average rating"
                />
              </Reveal>
            </div>

            {stats.topGenres.length > 0 && (
              <section className="mt-16">
                <Reveal>
                  <SectionHeading title="Your taste" />
                </Reveal>
                <div className="mt-7 max-w-xl space-y-4">
                  {stats.topGenres.map((entry, index) => {
                    const max = stats.topGenres[0].count || 1;
                    return (
                      <Reveal key={entry.genre} delay={index * 60}>
                        <div>
                          <div className="flex items-baseline justify-between">
                            <span className="font-display text-sm font-semibold text-ink">
                              {entry.genre}
                            </span>
                            <span className="text-xs text-muted-ink">
                              {entry.count}
                            </span>
                          </div>
                          <div className="mt-1.5 h-2 w-full rounded-sm bg-hairline/50">
                            <div
                              className="h-2 rounded-sm bg-accent/70 transition-[width] duration-700 ease-out"
                              style={{ width: `${(entry.count / max) * 100}%` }}
                            />
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
                <p className="mt-6 max-w-xl text-xs italic text-muted-ink">
                  Counted from the books you save and rate.
                </p>
              </section>
            )}
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
