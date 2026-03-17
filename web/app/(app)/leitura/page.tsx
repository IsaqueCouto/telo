import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDayNumber } from "@/lib/reading-plan";
import { fetchDailyChapters } from "@/lib/bible";
import type { Translation } from "@/lib/bible";
import { LeituraClient } from "./LeituraClient";

export default async function LeituraPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("pace, start_date, bible_translation")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  const dayNumber = getDayNumber(profile.start_date);
  const translation: Translation = (profile.bible_translation as Translation) ?? "nvi";

  const { data: devotional } = await supabase
    .from("devotionals")
    .select("chapters_text")
    .eq("day_number", dayNumber)
    .eq("pace", profile.pace)
    .single();

  if (!devotional?.chapters_text) {
    redirect("/hoje");
  }

  const chapters = await fetchDailyChapters(translation, devotional.chapters_text, supabase);

  return (
    <LeituraClient
      userId={user.id}
      dayNumber={dayNumber}
      chaptersText={devotional.chapters_text}
      chapters={chapters}
      initialTranslation={translation}
    />
  );
}
