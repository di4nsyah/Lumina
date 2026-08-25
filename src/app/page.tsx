import { getBooksByGenre } from "@/lib/bookService";
import { createClient } from "@/lib/supabase/server";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [shelves, supabase] = await Promise.all([
    getBooksByGenre(),
    createClient(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <HomeClient
      shelves={shelves}
      user={user ? { email: user.email ?? "" } : null}
    />
  );
}
