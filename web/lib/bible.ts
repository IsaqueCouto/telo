export type Translation = "nvi" | "acf";

export const TRANSLATION_LABELS: Record<Translation, string> = {
  nvi: "NVI",
  acf: "ACF",
};

export const BOOK_ABBR: Record<string, string> = {
  "Gênesis": "gn",       "Êxodo": "ex",          "Levítico": "lv",
  "Números": "nm",        "Deuteronômio": "dt",   "Josué": "js",
  "Juízes": "jz",         "Rute": "rt",            "1 Samuel": "1sm",
  "2 Samuel": "2sm",      "1 Reis": "1rs",         "2 Reis": "2rs",
  "1 Crônicas": "1cr",    "2 Crônicas": "2cr",     "Esdras": "ed",
  "Neemias": "ne",        "Ester": "et",           "Jó": "jó",
  "Salmos": "sl",         "Provérbios": "pv",      "Eclesiastes": "ec",
  "Cantares": "ct",       "Isaías": "is",          "Jeremias": "jr",
  "Lamentações": "lm",    "Ezequiel": "ez",        "Daniel": "dn",
  "Oséias": "os",         "Joel": "jl",            "Amós": "am",
  "Obadias": "ob",        "Jonas": "jn",           "Miquéias": "mq",
  "Naum": "na",           "Habacuque": "hc",       "Sofonias": "sf",
  "Ageu": "ag",           "Zacarias": "zc",        "Malaquias": "ml",
  "Mateus": "mt",         "Marcos": "mc",          "Lucas": "lc",
  "João": "jo",           "Atos": "at",            "Romanos": "rm",
  "1 Coríntios": "1co",   "2 Coríntios": "2co",    "Gálatas": "gl",
  "Efésios": "ef",        "Filipenses": "fp",      "Colossenses": "cl",
  "1 Tessalonicenses": "1ts", "2 Tessalonicenses": "2ts",
  "1 Timóteo": "1tm",     "2 Timóteo": "2tm",      "Tito": "tt",
  "Filemom": "fm",        "Hebreus": "hb",         "Tiago": "tg",
  "1 Pedro": "1pe",       "2 Pedro": "2pe",        "1 João": "1jo",
  "2 João": "2jo",        "3 João": "3jo",         "Judas": "jd",
  "Apocalipse": "ap",
};

export type BibleVerse = { number: number; text: string };

export type BibleChapter = {
  book: string;
  bookName: string;
  chapter: number;
  verses: BibleVerse[];
};

export function parseChaptersText(chaptersText: string): { book: string; chapters: number[] }[] {
  return chaptersText.split(",").map((part) => {
    const trimmed = part.trim();
    const match = trimmed.match(/^(.+?)\s+(\d+)(?:-(\d+))?$/);
    if (!match) return null;
    const book = match[1].trim();
    const start = parseInt(match[2]);
    const end = match[3] ? parseInt(match[3]) : start;
    return { book, chapters: Array.from({ length: end - start + 1 }, (_, i) => start + i) };
  }).filter(Boolean) as { book: string; chapters: number[] }[];
}

// Called server-side — reads from Supabase
export async function fetchDailyChapters(
  translation: Translation,
  chaptersText: string,
  supabase: import("@supabase/supabase-js").SupabaseClient
): Promise<BibleChapter[]> {
  const readings = parseChaptersText(chaptersText);
  const results: BibleChapter[] = [];

  for (const { book, chapters } of readings) {
    const abbr = BOOK_ABBR[book];
    if (!abbr) continue;

    for (const chapter of chapters) {
      const { data } = await supabase
        .from("bible_chapters")
        .select("book_name, chapter, verses")
        .eq("translation", translation)
        .eq("book_abbr", abbr)
        .eq("chapter", chapter)
        .single();

      if (data) {
        results.push({
          book: abbr,
          bookName: data.book_name,
          chapter: data.chapter,
          verses: data.verses as BibleVerse[],
        });
      }
    }
  }

  return results;
}
