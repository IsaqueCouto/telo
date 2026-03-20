import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PACE_DAYS, PACE_LABELS, getDayNumber } from "@/lib/reading-plan";
import { parseChaptersText } from "@/lib/bible";
import { BOOK_CHAPTER_COUNT } from "@/lib/bible-meta";
import { JornadaClient, type BookData } from "./JornadaClient";

const S = {
  bg:   "#F7F3EE",
  blue: "#3B82C4",
  ink:  "#0D0D0B",
  sans: "'Noto Sans', system-ui, sans-serif",
};

const ALL_BOOKS = [
  "Gênesis","Êxodo","Levítico","Números","Deuteronômio",
  "Josué","Juízes","Rute","1 Samuel","2 Samuel",
  "1 Reis","2 Reis","1 Crônicas","2 Crônicas","Esdras",
  "Neemias","Ester","Jó","Salmos","Provérbios",
  "Eclesiastes","Cantares","Isaías","Jeremias","Lamentações",
  "Ezequiel","Daniel","Oséias","Joel","Amós",
  "Obadias","Jonas","Miquéias","Naum","Habacuque",
  "Sofonias","Ageu","Zacarias","Malaquias",
  "Mateus","Marcos","Lucas","João","Atos",
  "Romanos","1 Coríntios","2 Coríntios","Gálatas","Efésios",
  "Filipenses","Colossenses","1 Tessalonicenses","2 Tessalonicenses","1 Timóteo",
  "2 Timóteo","Tito","Filemom","Hebreus","Tiago",
  "1 Pedro","2 Pedro","1 João","2 João","3 João",
  "Judas","Apocalipse",
];

export default async function JornadaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: completedDays }, { data: streak }] = await Promise.all([
    supabase.from("profiles").select("pace, start_date, plan_type").eq("id", user.id).single(),
    supabase.from("reading_progress").select("day_number").eq("user_id", user.id),
    supabase.from("streaks").select("current_streak, longest_streak").eq("user_id", user.id).single(),
  ]);

  if (!profile) redirect("/login");

  const completedDayNums = (completedDays ?? []).map((d: { day_number: number }) => d.day_number);
  const todayDayNumber = getDayNumber(profile.start_date);

  // Unlock everything from day 1 up to today's position (regardless of completion)
  const { data: readDevotionals } = await supabase
    .from("devotionals")
    .select("day_number, books_covered, chapters_text")
    .eq("pace", profile.pace)
    .lte("day_number", todayDayNumber);

  const sorted = (readDevotionals ?? []).sort((a, b) => a.day_number - b.day_number);

  // All days up to today unlock their books and chapters
  const startedBooks = new Set<string>();
  const bookUnlocked: Record<string, Set<number>> = {};

  for (const d of sorted) {
    for (const book of (d.books_covered ?? [])) startedBooks.add(book);
    for (const { book, chapters } of parseChaptersText(d.chapters_text ?? "")) {
      if (!bookUnlocked[book]) bookUnlocked[book] = new Set();
      chapters.forEach(c => bookUnlocked[book].add(c));
    }
  }

  // Current book = first book in today's devotional
  const todayDevotional = sorted.find(d => d.day_number === todayDayNumber);
  const currentBook = todayDevotional?.books_covered?.[0] ?? null;

  // Build booksData map for all 66 books
  const booksData: Record<string, BookData> = {};
  for (const book of ALL_BOOKS) {
    booksData[book] = {
      isCurrent: currentBook === book,
      isStarted: startedBooks.has(book),
      unlockedChapters: Array.from(bookUnlocked[book] ?? []).sort((a, b) => a - b),
      totalChapters: BOOK_CHAPTER_COUNT[book] ?? 0,
    };
  }

  const totalDays = PACE_DAYS[profile.pace as keyof typeof PACE_DAYS];
  const completed = completedDayNums.length;
  const percent   = Math.min(Math.round((completed / totalDays) * 100), 100);
  const paceLabel = PACE_LABELS[profile.pace as keyof typeof PACE_LABELS] ?? profile.pace;
  const remaining = totalDays - completed;

  return (
    <div style={{ background: S.bg, minHeight: "100vh", fontFamily: S.sans }}>

      {/* Frosted glass header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(247,243,238,0.82)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(226,219,208,0.45)",
        padding: "calc(env(safe-area-inset-top) + 44px) 24px 18px",
      }}>
        <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 6 }}>Telos</p>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: S.ink, letterSpacing: "-0.8px", lineHeight: 1.1 }}>Sua Bíblia</h1>
      </div>

      <JornadaClient
        percent={percent}
        completed={completed}
        remaining={remaining}
        paceLabel={paceLabel}
        totalDays={totalDays}
        streak={streak}
        booksData={booksData}
      />
    </div>
  );
}
