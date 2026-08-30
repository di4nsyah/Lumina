import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, User, Settings, BookOpen, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getReadingStats } from "@/lib/bookService";
import { listSavedCollection } from "@/lib/bookService";
import SiteHeader, { type SiteHeaderUser } from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionHeading from "@/components/ui/SectionHeading";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Reveal from "@/components/decor/Reveal";
import AccountEditor from "@/components/AccountEditor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Profile",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const siteUser: SiteHeaderUser = user ? { email: user.email ?? "" } : null;

  // Fetch user profile - profile may not exist if user just signed up
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("name, bio, favorite_genres, reading_mood, onboarded_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
  }

  // Fetch reading stats
  const stats = await getReadingStats(supabase, user.id);

  // Fetch saved collection
  const { shelves, total, savedIdByTitle } = await listSavedCollection(
    supabase,
    user.id,
  );

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <SiteHeader user={siteUser} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading title="My Profile" />
        </Reveal>

        <div className="mt-8 max-w-2xl mx-auto">

          {/* Profile Card */}
          <div className="space-y-6 p-6 rounded-md border border-hairline bg-surface">
            <AccountEditor
              initialName={profile?.name ?? ""}
              initialBio={profile?.bio ?? ""}
              onSave={(name, bio) => {
                supabase.from("user_profiles").update({ name, bio }).eq("id", user!.id);
                window.location.reload();
              }}
              onCancel={() => {}}
            />
            {profile ? (
              <div>
                <h2 className="font-display text-xl font-semibold text-ink">
                  {profile.name ?? "No name set"}
                </h2>
                <p className="text-muted-ink line-clamp-3">
                  {profile.bio ?? "No bio set"}
                </p>
              </div>
            ) : (
              <EmptyState
                title="Profile not found"
                body="Complete onboarding to set up your profile."
                action={
                  <Link href="/onboarding">
                    <Button variant="primary">Go to Onboarding</Button>
                  </Link>
                }
              />
            )}

            {/* Favorite Genres */}
            {profile?.favorite_genres && profile.favorite_genres.length > 0 ? (
              <div>
                <p className="text-sm font-medium text-ink mb-2">Favorite Genres</p>
                <div className="flex flex-wrap gap-2">
                  {profile.favorite_genres.map((genre: string) => (
                    <span
                      key={genre}
                      className="inline-flex items-center gap-1 rounded-md border border-hairline bg-paper px-2.5 py-1 text-xs font-medium text-muted-ink"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-ink">No favorite genres selected</p>
            )}

            {/* Reading Mood */}
            {profile?.reading_mood && (
              <div>
                <p className="text-sm text-muted-ink">
                  Reading mood:{" "}
                  {profile.reading_mood === "romance"
                    ? "Romance"
                    : profile.reading_mood === "mystery"
                    ? "Mystery"
                    : profile.reading_mood === "learn"
                    ? "Learning"
                    : profile.reading_mood === "escape"
                    ? "Escape"
                    : profile.reading_mood}
                </p>
              </div>
            )}

            {/* Reading Stats */}
            {stats.savedCount > 0 || stats.ratedCount > 0 || stats.topGenres.length > 0 ? (
              <div>
                <p className="text-sm font-medium text-ink mt-4">Reading Stats</p>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="font-medium text-ink">{stats.savedCount}</p>
                    <p className="text-xs text-muted-ink">Books saved</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-ink">{stats.ratedCount}</p>
                    <p className="text-xs text-muted-ink">Ratings given</p>
                  </div>
                  {stats.avgGiven !== null && (
                    <div className="text-center">
                      <p className="font-medium text-ink">{stats.avgGiven.toFixed(1)}</p>
                      <p className="text-xs text-muted-ink">Avg rating</p>
                    </div>
                  )}
                </div>
                {stats.topGenres.length > 0 && (
                  <p className="mt-3 text-sm text-muted-ink">
                    Top genre: {stats.topGenres[0].genre}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-6 text-muted-ink">
                Start saving books and rating them to see your stats here.
              </p>
            )}

            {/* Saved Collection */}
            {total > 0 ? (
              <div className="mt-6">
                <p className="text-sm font-medium text-ink mb-2">Your Collection ({total})</p>
                <p className="text-xs text-muted-ink mb-4">
                  Books you've saved from browsing and searching
                </p>
                <div className="rounded-md border border-hairline bg-surface p-4">
                  {shelves.length === 0 ? (
                    <p className="text-muted-ink">No shelves yet</p>
                  ) : (
                    shelves.map((shelf: any) => (
                      <div key={shelf.genre} className="mb-2 flex items-baseline justify-between text-sm">
                        <span className="font-medium text-ink">{shelf.genre}</span>
                        <span className="text-xs text-muted-ink">
                          {shelf.books.length} books
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-6 text-muted-ink">
                No saved books yet. Start by saving some books from the library!
              </p>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}