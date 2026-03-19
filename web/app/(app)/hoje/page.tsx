import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDayNumber, MILESTONES, PACE_DAYS } from "@/lib/reading-plan";
import { HojeClient } from "./HojeClient";
import type { Devotional } from "@/lib/types";

export default async function HojePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  const dayNumber = getDayNumber(profile.start_date);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [{ data: devotional }, { data: progress }, { data: streak }] = await Promise.all([
    (supabase.from("devotionals").select("day_number, pace, chapters_text, books_covered, key_verse, key_verse_reference, reflection").eq("day_number", dayNumber).eq("pace", profile.pace).single() as any) as Promise<{ data: Devotional | null }>,
    supabase.from("reading_progress").select("completed_at").eq("user_id", user.id).eq("day_number", dayNumber).single(),
    supabase.from("streaks").select("current_streak, longest_streak, last_read_date").eq("user_id", user.id).single(),
  ]);

  // Find the range of days for the current book being read
  const currentBook = (devotional?.books_covered ?? [])[0] ?? null;
  let bookStart = dayNumber;
  let bookEnd   = dayNumber;

  if (currentBook) {
    const { data: bookDays } = await supabase
      .from("devotionals")
      .select("day_number")
      .eq("pace", profile.pace)
      .contains("books_covered", [currentBook])
      .order("day_number");

    if (bookDays && bookDays.length > 0) {
      bookStart = bookDays[0].day_number;
      bookEnd   = bookDays[bookDays.length - 1].day_number;
    }
  }

  const milestone = MILESTONES.find((m) => m.day === dayNumber) ?? null;
  const totalDays = PACE_DAYS[profile.pace as keyof typeof PACE_DAYS];

  return (
    <HojeClient
      profile={profile}
      dayNumber={dayNumber}
      totalDays={totalDays}
      devotional={devotional}
      completedToday={!!progress?.completed_at}
      streak={streak}
      milestone={milestone}
      currentBook={currentBook}
      bookStart={bookStart}
      bookEnd={bookEnd}
    />
  );
}
