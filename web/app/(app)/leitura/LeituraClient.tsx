"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { BibleChapter, Translation } from "@/lib/bible";

const S = {
  bg:      "#F7F3EE",
  surface: "#EDE8DF",
  card:    "#FFFFFF",
  border:  "#E2DBD0",
  gray:    "#8C8279",
  muted:   "#C8BEB2",
  ink:     "#0D0D0B",
  copper:  "#D8683B",
  serif:   "'Vesper Libre', Georgia, serif",
  sans:    "'Noto Sans', system-ui, sans-serif",
};

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
  const [chapters, setChapters]       = useState<BibleChapter[]>(initialChapters);
  const [loading, setLoading]         = useState(false);
  const [, startTransition]           = useTransition();

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
    <div style={{ background: S.bg, minHeight: "100vh", fontFamily: S.sans }}>
      {/* Sticky header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(247,243,238,0.97)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${S.border}`,
        padding: "12px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={() => router.back()} style={{ fontSize: 14, fontWeight: 600, color: S.gray, background: "none", border: "none", cursor: "pointer", fontFamily: S.sans, padding: 0 }}>
          ← Voltar
        </button>
        <p style={{ fontFamily: S.serif, fontSize: 14, fontWeight: 700, color: S.ink, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
          {chaptersText}
        </p>
        {/* Translation toggle */}
        <div style={{ display: "flex", background: S.surface, borderRadius: 10, border: `1px solid ${S.border}`, overflow: "hidden" }}>
          {(["nvi", "acf"] as Translation[]).map((t) => (
            <button
              key={t}
              onClick={() => switchTranslation(t)}
              disabled={loading}
              style={{
                padding: "7px 13px", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: S.sans,
                background: translation === t ? S.copper : "transparent",
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
      <div style={{ padding: "28px 24px 100px", display: "flex", flexDirection: "column", gap: 48 }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 80 }}>
            <p style={{ fontSize: 14, color: S.gray }}>Carregando...</p>
          </div>
        ) : chapters.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 10 }}>
            <p style={{ fontSize: 32 }}>📖</p>
            <p style={{ fontSize: 14, color: S.gray, textAlign: "center" as const }}>Texto bíblico não encontrado.</p>
          </div>
        ) : (
          chapters.map((ch) => (
            <div key={`${ch.bookName}-${ch.chapter}`}>
              <h2 style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 900, color: S.ink, letterSpacing: "-0.3px", marginBottom: 6, lineHeight: 1.2 }}>
                {ch.bookName} {ch.chapter}
              </h2>
              <div style={{ width: 32, height: 2, background: S.copper, borderRadius: 99, marginBottom: 24 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {ch.verses.map((verse) => (
                  <p key={verse.number} style={{ fontFamily: S.serif, fontSize: 17, lineHeight: 1.9, color: "#3A3530" }}>
                    <sup style={{ fontSize: 10, fontWeight: 700, color: S.copper, marginRight: 4, verticalAlign: "super", fontFamily: S.sans }}>
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

      {/* Bottom bar */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(247,243,238,0.97)", borderTop: `1px solid ${S.border}`, padding: "12px 20px", textAlign: "center" as const, backdropFilter: "blur(20px)" }}>
        <p style={{ fontSize: 11, color: S.muted, fontFamily: S.sans }}>Dia {dayNumber} · {chaptersText} · {translation.toUpperCase()}</p>
      </div>
    </div>
  );
}
