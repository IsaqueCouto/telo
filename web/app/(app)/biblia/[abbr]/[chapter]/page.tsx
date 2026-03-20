import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchDailyChapters } from "@/lib/bible";
import type { Translation } from "@/lib/bible";
import { ABBR_TO_BOOK } from "@/lib/bible-meta";
import { BibleChapterClient } from "./BibleChapterClient";

export default async function BibliaChapterPage({
  params,
}: {
  params: Promise<{ abbr: string; chapter: string }>;
}) {
  const { abbr, chapter } = await params;
  const chapterNum = parseInt(chapter, 10);
  if (isNaN(chapterNum) || chapterNum < 1) redirect("/jornada");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("bible_translation")
    .eq("id", user.id)
    .single();

  const translation: Translation = (profile?.bible_translation as Translation) ?? "nvi";
  const decodedAbbr = decodeURIComponent(abbr);
  const bookName = ABBR_TO_BOOK[decodedAbbr];
  if (!bookName) redirect("/jornada");

  const chaptersText = `${bookName} ${chapterNum}`;
  const chapters = await fetchDailyChapters(translation, chaptersText, supabase);

  return (
    <BibleChapterClient
      bookName={bookName}
      abbr={decodedAbbr}
      chapter={chapterNum}
      chapters={chapters}
      chaptersText={chaptersText}
      initialTranslation={translation}
    />
  );
}
