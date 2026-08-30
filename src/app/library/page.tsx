import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listSavedCollection } from "@/lib/bookService";
import SiteHeader, { type SiteHeaderUser } from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionHeading from "@/components/ui/SectionHeading";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Reveal from "@/components/decor/Reveal";
import LibraryShelfClient from "@/components/LibraryShelfClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your library",
};

export default async function LibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/library");
  }
  const siteUser: SiteHeaderUser = user ? { email: user.email ?? "" } : null;

  const { shelves, total, savedIdByTitle } = await listSavedCollection(
    supabase,
    user.id,
  );

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <SiteHeader user={siteUser} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            title="Your library"
            sub={
              total > 0
                ? `${total} book${total === 1 ? "" : "s"} on your shelves.`
                : undefined
            }
            squiggle={total > 0}
          />
        </Reveal>

        {total === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Nothing on your shelf yet"
              body="Every collection starts with one book you couldn't stop thinking about."
              action={
                <Link href="/search">
                  <Button variant="primary">
                    Find your first
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-12">
            {shelves.map((shelf) => (
              <section key={shelf.genre}>
                <Reveal>
                  <div className="flex items-baseline justify-between">
                    <h2 className="font-display text-xl font-semibold text-ink">
                      {shelf.genre}
                    </h2>
                    <span className="text-xs text-muted-ink">
                      {shelf.books.length} on the shelf
                    </span>
                  </div>
                </Reveal>
                <LibraryShelfClient
                  shelfBooks={shelf.books}
                  savedIdByTitle={savedIdByTitle}
                  isAuthenticated
                />
              </section>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
