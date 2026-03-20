"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpenIcon } from "@/components/icons";
import type { BibleChapter, Translation } from "@/lib/bible";

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
};

type Props = {
  bookName: string;
  abbr: string;
  chapter: number;
  chapters: BibleChapter[];
  chaptersText: string;
  initialTranslation: Translation;
};

export function BibleChapterClient({ bookName, chapter, chapters: initialChapters, chaptersText, initialTranslation }: Props) {
  const router = useRouter();
  const [translation, setTranslation] = useState<Translation>(initialTranslation);
  const [chapters, setChapters]       = useState<BibleChapter[]>(initialChapters);
  const [loading, setLoading]         = useState(false);

  async function switchTranslation(t: Translation) {
    if (t === translation || loading) return;
    setLoading(true);
    const res = await fetch(`/api/bible?translation=${t}&chapters=${encodeURIComponent(chaptersText)}`);
    if (res.ok) {
      const data = await res.json();
      setChapters(data.chapters);
      setTranslation(t);
    }
    setLoading(false);
  }

  return (
    <div style={{ background: S.bg, minHeight: "100vh", fontFamily: S.sans }}>

      {/* Sticky frosted glass header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(247,243,238,0.82)",
        backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
        borderBottom: "1px solid rgba(226,219,208,0.45)",
        padding: "calc(env(safe-area-inset-top) + 10px) 20px 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{ fontSize: 14, fontWeight: 600, color: S.gray, background: "none", border: "none", cursor: "pointer", fontFamily: S.sans, padding: 0, flexShrink: 0 }}
        >
          ← Voltar
        </button>

        <p style={{ fontSize: 15, fontWeight: 700, color: S.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, flex: 1, textAlign: "center" as const }}>
          {bookName} {chapter}
        </p>

        <div style={{ display: "flex", background: S.surface, borderRadius: 10, border: `1px solid ${S.border}`, overflow: "hidden", flexShrink: 0 }}>
          {(["nvi", "acf"] as Translation[]).map((t) => (
            <button
              key={t}
              onClick={() => switchTranslation(t)}
              disabled={loading}
              style={{
                padding: "7px 13px", fontSize: 11, fontWeight: 700, border: "none",
                cursor: loading ? "default" : "pointer", fontFamily: S.sans,
                background: translation === t ? S.blue : "transparent",
                color: translation === t ? "#FFFFFF" : S.gray,
                letterSpacing: "0.04em", transition: "background 0.15s",
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Bible text */}
      <div style={{ padding: "28px 24px 120px" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 80 }}>
            <p style={{ fontSize: 14, color: S.gray }}>Carregando...</p>
          </div>
        ) : chapters.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 10 }}>
            <BookOpenIcon size={40} color={S.muted} />
            <p style={{ fontSize: 14, color: S.gray, textAlign: "center" as const }}>Texto bíblico não encontrado.</p>
          </div>
        ) : (
          chapters.map((ch) => (
            <div key={`${ch.bookName}-${ch.chapter}`}>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: S.ink, letterSpacing: "-0.4px", marginBottom: 6, lineHeight: 1.2 }}>
                {ch.bookName} {ch.chapter}
              </h2>
              <div style={{ width: 32, height: 2, background: S.blue, borderRadius: 99, marginBottom: 24 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {ch.verses.map((verse) => (
                  <p key={verse.number} style={{ fontSize: 17, lineHeight: 1.9, color: "#3A3530", borderRadius: 6, padding: "2px 4px 2px 8px", margin: "0 -4px" }}>
                    <sup style={{ fontSize: 10, fontWeight: 700, color: S.blue, marginRight: 4, verticalAlign: "super", fontFamily: S.sans }}>
                      {verse.number}
                    </sup>
                    {verse.text}
                  </p>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
