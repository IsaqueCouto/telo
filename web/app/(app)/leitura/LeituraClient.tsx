"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { BibleChapter, Translation } from "@/lib/bible";

const S = { bg: "#010101", card: "#1C1C1C", surface: "#141414", border: "#2A2A2A", muted: "#3A3A3A", gray: "#6B6B6B", subtle: "#9A9A9A", white: "#FFFFFF", orange: "#EB8530", gradient: "linear-gradient(135deg, #EB8530 0%, #E04724 100%)", font: "'Helvetica Neue', Helvetica, Arial, sans-serif" };

type Props = {
  userId: string;
  dayNumber: number;
  chaptersText: string;
  chapters: BibleChapter[];
  initialTranslation: Translation;
};

export function LeituraClient({ userId, dayNumber, chaptersText, chapters: initialChapters, initialTranslation }: Props) {
  const router = useRouter();
  const [translation, setTranslation] = useState<Translation>(initialTranslation);
  const [chapters, setChapters] = useState<BibleChapter[]>(initialChapters);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  async function switchTranslation(t: Translation) {
    if (t === translation || loading) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ bible_translation: t }).eq("id", userId);
    const res = await fetch(`/api/bible?translation=${t}&chapters=${encodeURIComponent(chaptersText)}`);
    if (res.ok) { const data = await res.json(); setChapters(data.chapters); setTranslation(t); }
    setLoading(false);
    startTransition(() => router.refresh());
  }

  return (
    <div style={{ background: S.bg, minHeight: "100vh", fontFamily: S.font }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(1,1,1,0.95)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${S.border}`, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => router.back()} style={{ fontSize: 13, fontWeight: 600, color: S.subtle, background: "none", border: "none", cursor: "pointer", fontFamily: S.font }}>
          ← Voltar
        </button>
        <p style={{ fontSize: 13, fontWeight: 700, color: S.white, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
          {chaptersText}
        </p>
        {/* Translation toggle */}
        <div style={{ display: "flex", background: S.card, borderRadius: 10, border: `1px solid ${S.border}`, overflow: "hidden" }}>
          {(["nvi", "acf"] as Translation[]).map((t) => (
            <button
              key={t}
              onClick={() => switchTranslation(t)}
              disabled={loading}
              style={{
                padding: "6px 12px", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: S.font,
                background: translation === t ? S.gradient : "transparent",
                color: translation === t ? S.white : S.gray,
                letterSpacing: "0.04em",
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Bible text */}
      <div style={{ padding: "24px 20px 80px", display: "flex", flexDirection: "column", gap: 40 }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 80 }}>
            <p style={{ fontSize: 14, color: S.gray }}>Carregando...</p>
          </div>
        ) : chapters.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 8 }}>
            <p style={{ fontSize: 28 }}>📖</p>
            <p style={{ fontSize: 14, color: S.gray, textAlign: "center" as const }}>Texto bíblico não encontrado.</p>
          </div>
        ) : (
          chapters.map((ch) => (
            <div key={`${ch.bookName}-${ch.chapter}`}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: S.orange, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${S.border}` }}>
                {ch.bookName} {ch.chapter}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {ch.verses.map((verse) => (
                  <p key={verse.number} style={{ fontSize: 16, lineHeight: 1.75, color: "#E8E8E8" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: S.orange, marginRight: 6, verticalAlign: "super" }}>
                      {verse.number}
                    </span>
                    {verse.text}
                  </p>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom label */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(1,1,1,0.95)", borderTop: `1px solid ${S.border}`, padding: "12px 20px", textAlign: "center" as const, backdropFilter: "blur(20px)" }}>
        <p style={{ fontSize: 11, color: S.gray }}>Dia {dayNumber} · {chaptersText} · {translation.toUpperCase()}</p>
      </div>
    </div>
  );
}
