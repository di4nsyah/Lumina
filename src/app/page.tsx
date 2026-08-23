import { getRecentBooks } from "@/lib/bookService";
import HomeClient from "@/components/HomeClient";

// The Gallery reads live from Supabase, so don't let Next.js cache this route.
export const dynamic = "force-dynamic";

export default async function Home() {
  const books = await getRecentBooks(8);

  return <HomeClient books={books} />;
}
