import { redirect } from "next/navigation";
import { BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import OnboardingClient from "@/components/OnboardingClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Personalize — LuminaBooks",
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
    <div className="min-h-screen bg-[#FBFBF9] text-slate-900 antialiased">
      <div className="flex justify-center pt-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm">
          <BookOpen className="h-6 w-6" strokeWidth={2.25} />
        </span>
      </div>
      <OnboardingClient initialGenres={genres} />
    </div>
  );
}
