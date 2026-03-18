"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Devotional, Streak, Note } from "@/lib/types";

const S = {
  bg:       "#010101",
  surface:  "#141414",
  card:     "#1C1C1C",
  border:   "#2A2A2A",
  muted:    "#3A3A3A",
  gray:     "#6B6B6B",
  subtle:   "#9A9A9A",
  white:    "#FFFFFF",
  orange:   "#EB8530",
  red:      "#E04724",
  gradient: "linear-gradient(135deg, #EB8530 0%, #E04724 100%)",
  font:     "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const mdComponents = {
  h2: ({ children }: any) => <h2 style={{ fontSize: 16, fontWeight: 800, color: "#FFFFFF", marginTop: 20, marginBottom: 8, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", letterSpacing: "-0.3px" }}>{children}</h2>,
  h3: ({ children }: any) => <h3 style={{ fontSize: 14, fontWeight: 700, color: "#EB8530", marginTop: 16, marginBottom: 6, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>{children}</h3>,
  p: ({ children }: any) => <p style={{ fontSize: 14, color: "#CCCCCC", lineHeight: 1.75, marginBottom: 10 }}>{children}</p>,
  ul: ({ children }: any) => <ul style={{ paddingLeft: 0, marginBottom: 10, listStyle: "none" }}>{children}</ul>,
  li: ({ children }: any) => (
    <li style={{ fontSize: 14, color: "#CCCCCC", lineHeight: 1.7, marginBottom: 6, paddingLeft: 16, position: "relative" }}>
      <span style={{ position: "absolute", left: 0, color: "#EB8530", fontWeight: 700 }}>·</span>
      {children}
    </li>
  ),
  strong: ({ children }: any) => <strong style={{ color: "#FFFFFF", fontWeight: 700 }}>{children}</strong>,
};

type Props = {
  userId: string;
  profile: Profile;
  dayNumber: number;
  totalDays: number;
  devotional: Devotional | null;
  completedToday: boolean;
  streak: Streak | null;
  milestone: { emoji: string; message: string } | null;
  isPro: boolean;
  existingNote: Note | null;
};

export function HojeClient({ userId, profile, dayNumber, totalDays, devotional, completedToday: initialCompleted, streak, milestone, isPro, existingNote }: Props) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [currentStreak, setCurrentStreak] = useState(streak?.current_streak ?? 0);
  const [isPending, startTransition] = useTransition();
  const [noteText, setNoteText] = useState(existingNote?.content ?? "");
  const [noteId, setNoteId] = useState(existingNote?.id ?? null);
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  async function markAsRead() {
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];
    await supabase.from("reading_progress").upsert({ user_id: userId, day_number: dayNumber, completed_at: new Date().toISOString() });
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    let newStreak = 1;
    if (streak) {
      if (streak.last_read_date === today) newStreak = streak.current_streak;
      else if (streak.last_read_date === yesterdayStr) newStreak = streak.current_streak + 1;
      await supabase.from("streaks").update({ current_streak: newStreak, longest_streak: Math.max(newStreak, streak.longest_streak), last_read_date: today, updated_at: new Date().toISOString() }).eq("user_id", userId);
    } else {
      await supabase.from("streaks").insert({ user_id: userId, current_streak: 1, longest_streak: 1, last_read_date: today });
    }
    setCompleted(true); setCurrentStreak(newStreak);
    startTransition(() => router.refresh());
  }

  async function saveNote() {
    if (!noteText.trim()) return;
    setNoteSaving(true);
    const supabase = createClient();
    if (noteId) {
      await supabase.from("notes").update({ content: noteText, updated_at: new Date().toISOString() }).eq("id", noteId);
    } else {
      const { data } = await supabase.from("notes").insert({ user_id: userId, day_number: dayNumber, content: noteText }).select("id").single();
      if (data) setNoteId(data.id);
    }
    setNoteSaving(false); setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  }

  const firstName = profile.full_name?.split(" ")[0] ?? "Olá";
  const percent = Math.min(Math.round((dayNumber / totalDays) * 100), 100);

  return (
    <div style={{ padding: "0 20px 24px", background: S.bg, minHeight: "100vh", fontFamily: S.font }}>

      {/* Header */}
      <div style={{ paddingTop: 56, paddingBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 13, color: S.gray, marginBottom: 2 }}>Bom dia,</p>
          <p style={{ fontSize: 24, fontWeight: 900, color: S.white, letterSpacing: "-0.5px" }}>{firstName}</p>
        </div>
        {/* Streak badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: S.card, border: `1px solid ${S.border}`, borderRadius: 100, padding: "8px 14px" }}>
          <span style={{ fontSize: 16 }}>🔥</span>
          <span style={{ fontSize: 13, fontWeight: 700, background: S.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {currentStreak} {currentStreak === 1 ? "dia" : "dias"}
          </span>
        </div>
      </div>

      {/* Progress strip */}
      <div style={{ background: S.card, borderRadius: 16, padding: "16px", marginBottom: 16, border: `1px solid ${S.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: S.gray, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Progresso</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: S.orange }}>{percent}% da Bíblia</span>
        </div>
        <div style={{ height: 3, background: S.muted, borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${percent}%`, background: S.gradient, borderRadius: 99, transition: "width 0.6s ease" }} />
        </div>
        <p style={{ fontSize: 11, color: S.gray, marginTop: 8 }}>Dia {dayNumber} de {totalDays}</p>
      </div>

      {/* Milestone */}
      {milestone && (
        <div style={{ background: S.gradient, borderRadius: 20, padding: "16px 20px", marginBottom: 16, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 4 }}>{milestone.emoji}</div>
          <p style={{ color: S.white, fontWeight: 700, fontSize: 15 }}>{milestone.message}</p>
        </div>
      )}

      {/* Today's reading card */}
      <div style={{ background: S.card, borderRadius: 20, padding: "20px", marginBottom: 12, border: `1px solid ${S.border}` }}>
        <p style={{ fontSize: 11, color: S.orange, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 8 }}>
          Leitura de hoje
        </p>
        {devotional ? (
          <>
            <p style={{ fontSize: 22, fontWeight: 900, color: S.white, letterSpacing: "-0.5px", marginBottom: 16, lineHeight: 1.2 }}>
              {devotional.chapters_text}
            </p>
            {devotional.key_verse && (
              <div style={{ background: S.surface, borderRadius: 12, padding: "14px", borderLeft: `3px solid ${S.orange}` }}>
                <p style={{ fontSize: 13, color: "#CCCCCC", lineHeight: 1.6, fontStyle: "italic" }}>
                  &ldquo;{devotional.key_verse}&rdquo;
                </p>
                {devotional.key_verse_reference && (
                  <p style={{ fontSize: 11, color: S.orange, fontWeight: 700, marginTop: 8 }}>— {devotional.key_verse_reference}</p>
                )}
              </div>
            )}
            <Link
              href="/leitura"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14, background: S.surface, border: `1px solid ${S.border}`, borderRadius: 12, padding: "12px", textDecoration: "none" }}
            >
              <span style={{ fontSize: 14 }}>📖</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: S.subtle }}>Ler os capítulos de hoje</span>
            </Link>
          </>
        ) : (
          <p style={{ fontSize: 14, color: S.gray }}>Conteúdo sendo preparado para o dia {dayNumber}.</p>
        )}
      </div>

      {/* Pro content */}
      {devotional && isPro ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {devotional.reflection && (
            <div style={{ background: S.card, borderRadius: 20, padding: "20px", border: `1px solid ${S.border}` }}>
              <p style={{ fontSize: 11, color: S.orange, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 4 }}>O que você leu</p>
              <p style={{ fontSize: 11, color: S.gray, marginBottom: 16 }}>Resumo e explicação dos capítulos</p>
              <div className="prose-telo">
                <ReactMarkdown components={mdComponents}>{devotional.reflection}</ReactMarkdown>
              </div>
            </div>
          )}
          {devotional.historical_context && (
            <div style={{ background: S.card, borderRadius: 20, padding: "20px", border: `1px solid ${S.border}` }}>
              <p style={{ fontSize: 11, color: S.orange, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 16 }}>Contexto histórico</p>
              <div className="prose-telo">
                <ReactMarkdown components={mdComponents}>{devotional.historical_context}</ReactMarkdown>
              </div>
            </div>
          )}
          {devotional.youtube_search_terms && devotional.youtube_search_terms.length > 0 && (
            <div style={{ background: S.card, borderRadius: 20, padding: "20px", border: `1px solid ${S.border}` }}>
              <p style={{ fontSize: 11, color: S.orange, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 12 }}>Aprofunde-se</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {devotional.youtube_search_terms.map((term, i) => (
                  <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(term)}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 10, background: S.surface, borderRadius: 10, padding: "12px 14px", textDecoration: "none" }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>▶</span>
                    <span style={{ fontSize: 13, color: "#CCCCCC" }}>{term}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          {devotional.discussion_questions && devotional.discussion_questions.length > 0 && (
            <div style={{ background: S.card, borderRadius: 20, padding: "20px", border: `1px solid ${S.border}` }}>
              <p style={{ fontSize: 11, color: S.orange, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 12 }}>Para refletir</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {devotional.discussion_questions.map((q, i) => (
                  <div key={i} style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: S.orange, flexShrink: 0, paddingTop: 2 }}>{i + 1}.</span>
                    <p style={{ fontSize: 14, color: "#CCCCCC", lineHeight: 1.6 }}>{q}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Notes */}
          <div style={{ background: S.card, borderRadius: 20, padding: "20px", border: `1px solid ${S.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: S.orange, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Anotações</p>
              {noteSaved && <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 600 }}>Salvo ✓</span>}
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Escreva suas reflexões ou insights sobre a leitura de hoje..."
              rows={4}
              style={{ width: "100%", background: S.surface, border: `1px solid ${S.border}`, borderRadius: 12, padding: "12px", fontSize: 13, color: S.white, outline: "none", resize: "none", fontFamily: S.font, lineHeight: 1.6, boxSizing: "border-box" }}
            />
            <button
              onClick={saveNote}
              disabled={noteSaving || !noteText.trim()}
              style={{ marginTop: 10, width: "100%", background: noteText.trim() ? S.gradient : S.muted, color: S.white, borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: S.font }}
            >
              {noteSaving ? "Salvando..." : "Salvar anotação"}
            </button>
          </div>
        </div>
      ) : devotional && !isPro ? (
        <div style={{ position: "relative", marginBottom: 4 }}>
          <div style={{ background: S.card, borderRadius: 20, padding: "20px", border: `1px solid ${S.border}`, opacity: 0.2, pointerEvents: "none", userSelect: "none" }}>
            <p style={{ fontSize: 11, color: S.orange, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 8 }}>O que você leu</p>
            <p style={{ fontSize: 14, color: "#CCCCCC", lineHeight: 1.7 }}>Explicação detalhada, contexto histórico, vídeos sugeridos e anotações pessoais...</p>
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button
              onClick={() => router.push("/pro")}
              style={{ background: S.gradient, color: S.white, borderRadius: 14, padding: "14px 28px", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: S.font, boxShadow: "0 8px 32px rgba(235,133,48,0.3)" }}
            >
              Desbloquear Pro
            </button>
          </div>
        </div>
      ) : null}

      {/* Mark as read */}
      <div style={{ marginTop: 16 }}>
        {completed ? (
          <div style={{ background: S.card, border: `1px solid #1a3a1a`, borderRadius: 20, padding: "20px", textAlign: "center" }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#4ade80" }}>Lido hoje ✓</p>
            <p style={{ fontSize: 13, color: S.gray, marginTop: 4 }}>Continue amanhã!</p>
          </div>
        ) : (
          <button
            onClick={markAsRead}
            disabled={isPending}
            style={{ width: "100%", background: isPending ? S.muted : S.gradient, color: S.white, borderRadius: 20, padding: "20px", fontSize: 16, fontWeight: 900, border: "none", cursor: "pointer", fontFamily: S.font, letterSpacing: "-0.3px", boxShadow: isPending ? "none" : "0 8px 32px rgba(235,133,48,0.25)" }}
          >
            {isPending ? "Salvando..." : "Li hoje"}
          </button>
        )}
      </div>
    </div>
  );
}
