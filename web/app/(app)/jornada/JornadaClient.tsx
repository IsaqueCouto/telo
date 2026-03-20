"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FireIcon, LockIcon, XIcon } from "@/components/icons";
import { BOOK_CHAPTER_COUNT } from "@/lib/bible-meta";

const S = {
  bg:      "#F7F3EE",
  surface: "#EDE8DF",
  card:    "#FFFFFF",
  border:  "#E2DBD0",
  gray:    "#8C8279",
  muted:   "#C8BEB2",
  ink:     "#0D0D0B",
  blue:    "#3B82C4",
  sans:    "'Noto Sans', system-ui, sans-serif",
  serif:   "'Noto Sans', system-ui, sans-serif",
};

const ABBR: Record<string, string> = {
  "Gênesis":"Gn",    "Êxodo":"Êx",      "Levítico":"Lv",    "Números":"Nm",     "Deuteronômio":"Dt",
  "Josué":"Js",      "Juízes":"Jz",      "Rute":"Rt",        "1 Samuel":"1Sm",   "2 Samuel":"2Sm",
  "1 Reis":"1Rs",    "2 Reis":"2Rs",     "1 Crônicas":"1Cr", "2 Crônicas":"2Cr", "Esdras":"Esd",
  "Neemias":"Ne",    "Ester":"Et",       "Jó":"Jó",          "Salmos":"Sl",      "Provérbios":"Pv",
  "Eclesiastes":"Ec","Cantares":"Ct",    "Isaías":"Is",      "Jeremias":"Jr",    "Lamentações":"Lm",
  "Ezequiel":"Ez",   "Daniel":"Dn",      "Oséias":"Os",      "Joel":"Jl",        "Amós":"Am",
  "Obadias":"Ob",    "Jonas":"Jn",       "Miquéias":"Mq",    "Naum":"Na",        "Habacuque":"Hc",
  "Sofonias":"Sf",   "Ageu":"Ag",        "Zacarias":"Zc",    "Malaquias":"Ml",
  "Mateus":"Mt",     "Marcos":"Mc",      "Lucas":"Lc",       "João":"Jo",        "Atos":"At",
  "Romanos":"Rm",    "1 Coríntios":"1Co","2 Coríntios":"2Co","Gálatas":"Gl",     "Efésios":"Ef",
  "Filipenses":"Fp", "Colossenses":"Cl", "1 Tessalonicenses":"1Ts","2 Tessalonicenses":"2Ts","1 Timóteo":"1Tm",
  "2 Timóteo":"2Tm", "Tito":"Tt",        "Filemom":"Fm",     "Hebreus":"Hb",     "Tiago":"Tg",
  "1 Pedro":"1Pe",   "2 Pedro":"2Pe",    "1 João":"1Jo",     "2 João":"2Jo",     "3 João":"3Jo",
  "Judas":"Jd",      "Apocalipse":"Ap",
};

const OLD_TESTAMENT = [
  "Gênesis","Êxodo","Levítico","Números","Deuteronômio",
  "Josué","Juízes","Rute","1 Samuel","2 Samuel",
  "1 Reis","2 Reis","1 Crônicas","2 Crônicas","Esdras",
  "Neemias","Ester","Jó","Salmos","Provérbios",
  "Eclesiastes","Cantares","Isaías","Jeremias","Lamentações",
  "Ezequiel","Daniel","Oséias","Joel","Amós",
  "Obadias","Jonas","Miquéias","Naum","Habacuque",
  "Sofonias","Ageu","Zacarias","Malaquias",
];
const NEW_TESTAMENT = [
  "Mateus","Marcos","Lucas","João","Atos",
  "Romanos","1 Coríntios","2 Coríntios","Gálatas","Efésios",
  "Filipenses","Colossenses","1 Tessalonicenses","2 Tessalonicenses","1 Timóteo",
  "2 Timóteo","Tito","Filemom","Hebreus","Tiago",
  "1 Pedro","2 Pedro","1 João","2 João","3 João",
  "Judas","Apocalipse",
];

export type BookData = {
  isCurrent: boolean;
  isStarted: boolean;
  unlockedChapters: number[];
  totalChapters: number;
};

type Props = {
  percent: number;
  completed: number;
  remaining: number;
  paceLabel: string;
  totalDays: number;
  streak: { current_streak: number; longest_streak: number } | null;
  booksData: Record<string, BookData>;
};

export function JornadaClient({ percent, completed, remaining, paceLabel, totalDays, streak, booksData }: Props) {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;

  const sheetData = selectedBook ? booksData[selectedBook] : null;
  const sheetAbbr = selectedBook ? (ABBR[selectedBook] ?? selectedBook.substring(0, 3)) : "";
  const unlockedSet = new Set(sheetData?.unlockedChapters ?? []);

  function handleBookClick(book: string) {
    const data = booksData[book];
    if (data?.isCurrent || data?.isStarted) setSelectedBook(book);
  }

  function handleChapterClick(abbr: string, chapter: number) {
    router.push(`/biblia/${encodeURIComponent(abbr)}/${chapter}`);
  }

  return (
    <>
      <div style={{ padding: "20px 24px 100px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Completion ring + stats */}
        <div style={{ background: S.card, borderRadius: 24, padding: "28px 24px", border: `1px solid ${S.border}`, display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ flexShrink: 0 }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r={r} fill="none" stroke={S.surface} strokeWidth="10"/>
              <circle cx="65" cy="65" r={r} fill="none" stroke={S.blue} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`} transform="rotate(-90 65 65)" />
              <text x="65" y="60" textAnchor="middle" fontFamily="'Noto Sans', sans-serif" fontSize="20" fontWeight="900" fill={S.blue}>{percent}%</text>
              <text x="65" y="78" textAnchor="middle" fontFamily="'Noto Sans', sans-serif" fontSize="9" fill={S.gray}>da Bíblia</text>
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <p style={{ fontSize: 28, fontWeight: 900, color: S.ink, letterSpacing: "-1px", lineHeight: 1 }}>{completed}</p>
              <p style={{ fontSize: 11, color: S.gray, marginTop: 2 }}>dias lidos</p>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <p style={{ fontSize: 28, fontWeight: 900, color: S.blue, letterSpacing: "-1px", lineHeight: 1 }}>{streak?.current_streak ?? 0}</p>
                <FireIcon size={22} color="#E07A30" />
              </div>
              <p style={{ fontSize: 11, color: S.gray, marginTop: 2 }}>sequência atual</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: S.muted }}>Plano de {paceLabel}</p>
              {remaining > 0 && <p style={{ fontSize: 11, color: S.muted }}>{remaining} dias restantes</p>}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ background: S.card, borderRadius: 16, padding: "16px 20px", border: `1px solid ${S.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: S.gray, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.07em" }}>Progresso geral</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: S.blue }}>{percent}% completo</span>
          </div>
          <div style={{ height: 5, background: S.surface, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${percent}%`, background: S.blue, borderRadius: 99 }} />
          </div>
          <p style={{ fontSize: 11, color: S.muted, marginTop: 8 }}>Plano de {paceLabel} · {completed} de {totalDays} dias</p>
        </div>

        {/* Old Testament grid */}
        <div style={{ background: S.card, borderRadius: 20, padding: "20px", border: `1px solid ${S.border}` }}>
          <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 4 }}>Antigo Testamento</p>
          <p style={{ fontSize: 12, color: S.gray, marginBottom: 16 }}>39 livros · toque para explorar</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
            {OLD_TESTAMENT.map((book) => (
              <BookTile key={book} book={book}
                data={booksData[book] ?? { isCurrent: false, isStarted: false, unlockedChapters: [], totalChapters: 0 }}
                onClick={handleBookClick} />
            ))}
          </div>
        </div>

        {/* New Testament grid */}
        <div style={{ background: S.card, borderRadius: 20, padding: "20px", border: `1px solid ${S.border}` }}>
          <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 4 }}>Novo Testamento</p>
          <p style={{ fontSize: 12, color: S.gray, marginBottom: 16 }}>27 livros · toque para explorar</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
            {NEW_TESTAMENT.map((book) => (
              <BookTile key={book} book={book}
                data={booksData[book] ?? { isCurrent: false, isStarted: false, unlockedChapters: [], totalChapters: 0 }}
                onClick={handleBookClick} />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, padding: "4px 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: S.blue }} />
            <span style={{ fontSize: 11, color: S.gray }}>Leitura atual</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#EBF3FA", border: "1px solid #BFDBF7" }} />
            <span style={{ fontSize: 11, color: S.gray }}>Desbloqueado</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: S.surface, border: `1px solid ${S.border}` }} />
            <span style={{ fontSize: 11, color: S.gray }}>Bloqueado</span>
          </div>
        </div>

      </div>

      {/* Chapter picker bottom sheet */}
      {selectedBook && sheetData && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedBook(null); }}
        >
          {/* Backdrop */}
          <div
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}
            onClick={() => setSelectedBook(null)}
          />

          {/* Sheet */}
          <div style={{
            position: "relative",
            background: S.card,
            borderRadius: "24px 24px 0 0",
            padding: "0 0 calc(env(safe-area-inset-bottom) + 32px)",
            maxWidth: 480,
            margin: "0 auto",
            width: "100%",
            maxHeight: "82vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.20)",
          }}>
            {/* Drag handle */}
            <div style={{ padding: "14px 24px 0", flexShrink: 0 }}>
              <div style={{ width: 40, height: 4, background: S.border, borderRadius: 99, margin: "0 auto 18px" }} />
            </div>

            {/* Sheet header */}
            <div style={{ padding: "0 24px 16px", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: S.ink, letterSpacing: "-0.4px", lineHeight: 1.2 }}>
                    {selectedBook}
                  </h2>
                  <p style={{ fontSize: 12, color: S.gray, marginTop: 4 }}>
                    {sheetData.totalChapters} {sheetData.totalChapters === 1 ? "capítulo" : "capítulos"}
                    {" · "}
                    <span style={{ color: S.blue, fontWeight: 600 }}>{sheetData.unlockedChapters.length} {sheetData.unlockedChapters.length === 1 ? "desbloqueado" : "desbloqueados"}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBook(null)}
                  style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 99, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                  aria-label="Fechar"
                >
                  <XIcon size={16} color={S.gray} strokeWidth={2} />
                </button>
              </div>
              <div style={{ height: 1, background: S.border, marginTop: 16 }} />
            </div>

            {/* Chapter grid — scrollable */}
            <div style={{ padding: "0 24px", overflowY: "auto", flex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, paddingBottom: 16 }}>
                {Array.from({ length: sheetData.totalChapters }, (_, i) => i + 1).map((chapter) => (
                  <ChapterTile
                    key={chapter}
                    chapter={chapter}
                    isUnlocked={unlockedSet.has(chapter)}
                    abbr={sheetAbbr}
                    onNavigate={handleChapterClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function BookTile({ book, data, onClick }: { book: string; data: BookData; onClick: (book: string) => void }) {
  const { isCurrent, isStarted } = data;
  const isLocked = !isCurrent && !isStarted;
  const bg     = isCurrent ? S.blue   : isStarted ? "#EBF3FA" : S.surface;
  const border = isCurrent ? S.blue   : isStarted ? "#BFDBF7" : S.border;
  const color  = isCurrent ? "#FFFFFF" : isStarted ? S.blue   : S.muted;

  return (
    <div
      onClick={() => onClick(book)}
      title={book}
      style={{
        aspectRatio: "1", borderRadius: 8, position: "relative",
        background: bg, border: `1px solid ${border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 4, cursor: isLocked ? "default" : "pointer",
        boxShadow: isCurrent ? "0 2px 8px rgba(59,130,196,0.4)" : "none",
        transition: "transform 0.1s, box-shadow 0.1s",
      }}
    >
      <span style={{ fontSize: 9, color, fontFamily: S.sans, fontWeight: 700, textAlign: "center" as const, lineHeight: 1.2 }}>
        {ABBR[book] ?? book.substring(0, 3)}
      </span>
      {isLocked && (
        <span style={{ position: "absolute", bottom: 2, right: 2, display: "flex", opacity: 0.45 }}>
          <LockIcon size={8} color={S.muted} strokeWidth={2} />
        </span>
      )}
    </div>
  );
}

function ChapterTile({ chapter, isUnlocked, abbr, onNavigate }: {
  chapter: number;
  isUnlocked: boolean;
  abbr: string;
  onNavigate: (abbr: string, chapter: number) => void;
}) {
  if (isUnlocked) {
    return (
      <button
        onClick={() => onNavigate(abbr, chapter)}
        style={{
          aspectRatio: "1", borderRadius: 10, background: S.blue, border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 2px 6px rgba(59,130,196,0.30)",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "#FFF", fontFamily: S.sans }}>{chapter}</span>
      </button>
    );
  }
  return (
    <div style={{
      aspectRatio: "1", borderRadius: 10,
      background: S.surface, border: `1px solid ${S.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative",
    }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: S.muted, fontFamily: S.sans }}>{chapter}</span>
      <span style={{ position: "absolute", bottom: 3, right: 3, display: "flex", opacity: 0.55 }}>
        <LockIcon size={8} color={S.muted} strokeWidth={2} />
      </span>
    </div>
  );
}
