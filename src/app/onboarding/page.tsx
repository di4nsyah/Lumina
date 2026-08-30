import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OnboardingClient from "@/components/OnboardingClient";
import Wordmark from "@/components/ui/Wordmark";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Personalize",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/onboarding");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("favorite_genres")
    .eq("id", user.id)
    .maybeSingle();

  const genres = ((profile as { favorite_genres?: string[] } | null)
    ?.favorite_genres ?? []).filter(
    (genre): genre is string => typeof genre === "string",
  );

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <div className="flex justify-center pt-12">
        <Wordmark />
      </div>
      <OnboardingClient initialGenres={genres} />
    </div>
  );
}
