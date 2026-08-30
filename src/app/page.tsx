import {
  getBooksByGenre,
  getFavoriteGenres,
  getRecentBooks,
  getRecommendedBooks,
  type RecommendationResult,
} from "@/lib/bookService";
import { createClient } from "@/lib/supabase/server";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const [shelves, staffPicks, session] = await Promise.all([
    getBooksByGenre(),
    getRecentBooks(3),
    supabase.auth.getUser(),
  ]);
  const user = session.data.user;

  let recommended: RecommendationResult | null = null;
  if (user) {
    const favoriteGenres = await getFavoriteGenres(supabase, user.id);
    recommended = await getRecommendedBooks(supabase, {
      userId: user.id,
      favoriteGenres,
    });
  }

  return (
    <HomeClient
      shelves={shelves}
      staffPicks={staffPicks}
      user={user ? { email: user.email ?? "" } : null}
      recommended={recommended}
    />
  );
}
