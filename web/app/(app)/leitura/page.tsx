import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDayNumber } from "@/lib/reading-plan";
import { fetchDailyChapters } from "@/lib/bible";
import type { Translation } from "@/lib/bible";
import type { Devotional, Note } from "@/lib/types";
import { LeituraClient } from "./LeituraClient";

export default async function LeituraPage({ searchParams }: { searchParams: Promise<{ day?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("pace, start_date, bible_translation, plan_type")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  const params = await searchParams;
  const dayOverride = params?.day ? parseInt(params.day, 10) : null;
  const dayNumber = dayOverride && !isNaN(dayOverride) && dayOverride > 0
    ? dayOverride
    : getDayNumber(profile.start_date);
  const translation: Translation = (profile.bible_translation as Translation) ?? "nvi";
  const isPro = profile.plan_type === "pro";

  const columns = isPro
    ? "day_number, pace, chapters_text, books_covered, key_verse, key_verse_reference, reflection, historical_context, discussion_questions, youtube_search_terms"
    : "day_number, pace, chapters_text, books_covered, key_verse, key_verse_reference";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: devotional } = (await supabase.from("devotionals").select(columns).eq("day_number", dayNumber).eq("pace", profile.pace).single()) as any as { data: Devotional | null };

  if (!devotional?.chapters_text) redirect("/hoje");

  const [chapters, { data: notes }, { data: progress }, { data: streak }] = await Promise.all([
    fetchDailyChapters(translation, devotional!.chapters_text, supabase),
    isPro
      ? supabase.from("notes").select("id, content, verse_reference, day_number, created_at, updated_at").eq("user_id", user.id).eq("day_number", dayNumber)
      : Promise.resolve({ data: [] as Note[] }),
    supabase.from("reading_progress").select("completed_at").eq("user_id", user.id).eq("day_number", dayNumber).single(),
    supabase.from("streaks").select("current_streak, longest_streak, last_read_date").eq("user_id", user.id).single(),
  ]);

  return (
    <LeituraClient
      userId={user.id}
      dayNumber={dayNumber}
      chaptersText={devotional!.chapters_text}
      chapters={chapters}
      initialTranslation={translation}
      devotional={devotional}
      isPro={isPro}
      existingNotes={(notes ?? []) as Note[]}
      completedToday={!!progress?.completed_at}
      streak={streak}
    />
  );
}
