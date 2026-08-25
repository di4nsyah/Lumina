import { createClient } from "@/lib/supabase/server";
import SearchClient from "@/components/SearchClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search — LuminaBooks",
};

export default async function SearchPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <SearchClient user={user ? { email: user.email ?? "" } : null} />;
}
