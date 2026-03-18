"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Devotional, Streak, Note } from "@/lib/types";

const S = {
  bg:      "#F7F3EE",
  surface: "#EDE8DF",
  card:    "#FFFFFF",
  border:  "#E2DBD0",
  muted:   "#C8BEB2",
  gray:    "#8C8279",
  subtle:  "#B0A89F",
  ink:     "#0D0D0B",
  copper:  "#D8683B",
  serif:   "'Vesper Libre', Georgia, serif",
  sans:    "'Noto Sans', system-ui, sans-serif",
};

const mdComponents = {
  h2: ({ children }: any) => <h2 style={{ fontFamily: S.serif, fontSize: 18, fontWeight: 900, color: S.ink, marginTop: 24, marginBottom: 10, letterSpacing: "-0.3px", lineHeight: 1.3 }}>{children}</h2>,
  h3: ({ children }: any) => <h3 style={{ fontFamily: S.serif, fontSize: 15, fontWeight: 700, color: S.copper, marginTop: 18, marginBottom: 6, lineHeight: 1.4 }}>{children}</h3>,
  p: ({ children }: any) => <p style={{ fontFamily: S.sans, fontSize: 14, color: "#4A4540", lineHeight: 1.8, marginBottom: 12 }}>{children}</p>,
  ul: ({ children }: any) => <ul style={{ paddingLeft: 0, marginBottom: 12, listStyle: "none" }}>{children}</ul>,
  li: ({ children }: any) => (
    <li style={{ fontFamily: S.sans, fontSize: 14, color: "#4A4540", lineHeight: 1.7, marginBottom: 8, paddingLeft: 20, position: "relative" }}>
      <span style={{ position: "absolute", left: 0, color: S.copper, fontWeight: 700 }}>·</span>
      {children}
    </li>
  ),
  strong: ({ children }: any) => <strong style={{ color: S.ink, fontWeight: 700 }}>{children}</strong>,
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
  const [completed, setCompleted]       = useState(initialCompleted);
  const [currentStreak, setCurrentStreak] = useState(streak?.current_streak ?? 0);
  const [isPending, startTransition]    = useTransition();
  const [noteText, setNoteText]         = useState(existingNote?.content ?? "");
  const [noteId, setNoteId]             = useState(existingNote?.id ?? null);
  const [noteSaving, setNoteSaving]     = useState(false);
  const [noteSaved, setNoteSaved]       = useState(false);

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
  const percent   = Math.min(Math.round((dayNumber / totalDays) * 100), 100);

  return (
    <div style={{ background: S.bg, minHeight: "100vh", fontFamily: S.sans }}>

      {/* Header */}
      <div style={{ padding: "52px 24px 20px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 13, color: S.gray, marginBottom: 3, fontFamily: S.sans }}>Bom dia,</p>
          <p style={{ fontFamily: S.serif, fontSize: 28, fontWeight: 900, color: S.ink, letterSpacing: "-0.5px", lineHeight: 1 }}>{firstName}</p>
        </div>
        {/* Streak */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: S.card, border: `1px solid ${S.border}`, borderRadius: 100, padding: "8px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <span style={{ fontSize: 15 }}>🔥</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: S.copper, fontFamily: S.sans }}>
            {currentStreak} {currentStreak === 1 ? "dia" : "dias"}
          </span>
        </div>
      </div>

      <div style={{ padding: "0 24px 28px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Progress strip */}
        <div style={{ background: S.card, borderRadius: 16, padding: "18px 20px", border: `1px solid ${S.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: S.gray, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>Progresso</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: S.copper }}>{percent}% completo</span>
          </div>
          <div style={{ height: 4, background: S.surface, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${percent}%`, background: S.copper, borderRadius: 99, transition: "width 0.6s ease" }} />
          </div>
          <p style={{ fontSize: 12, color: S.muted, marginTop: 8, fontFamily: S.sans }}>Dia {dayNumber} de {totalDays}</p>
        </div>

        {/* Milestone */}
        {milestone && (
          <div style={{ background: S.copper, borderRadius: 16, padding: "18px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>{milestone.emoji}</div>
            <p style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 15, fontFamily: S.serif }}>{milestone.message}</p>
          </div>
        )}

        {/* Today's reading card */}
        <div style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: 11, color: S.copper, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 10, fontFamily: S.sans }}>
            Leitura de hoje
          </p>
          {devotional ? (
            <>
              <p style={{ fontFamily: S.serif, fontSize: 24, fontWeight: 900, color: S.ink, letterSpacing: "-0.5px", marginBottom: 18, lineHeight: 1.2 }}>
                {devotional.chapters_text}
              </p>
              {devotional.key_verse && (
                <div style={{ background: S.bg, borderRadius: 12, padding: "16px", borderLeft: `3px solid ${S.copper}`, marginBottom: 16 }}>
                  <p style={{ fontFamily: S.serif, fontSize: 14, color: "#4A4540", lineHeight: 1.7, fontStyle: "italic" }}>
                    &ldquo;{devotional.key_verse}&rdquo;
                  </p>
                  {devotional.key_verse_reference && (
                    <p style={{ fontFamily: S.sans, fontSize: 12, color: S.copper, fontWeight: 700, marginTop: 8 }}>— {devotional.key_verse_reference}</p>
                  )}
                </div>
              )}
              <Link
                href="/leitura"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: S.bg, border: `1px solid ${S.border}`, borderRadius: 12, padding: "13px", textDecoration: "none" }}
              >
                <span style={{ fontSize: 14 }}>📖</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: S.gray, fontFamily: S.sans }}>Ler os capítulos de hoje</span>
              </Link>
            </>
          ) : (
            <p style={{ fontSize: 14, color: S.gray }}>Conteúdo sendo preparado para o dia {dayNumber}.</p>
          )}
        </div>

        {/* Pro content */}
        {devotional && isPro ? (
          <>
            {devotional.reflection && (
              <div style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize: 11, color: S.copper, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 4, fontFamily: S.sans }}>O que você leu</p>
                <p style={{ fontSize: 12, color: S.muted, marginBottom: 16, fontFamily: S.sans }}>Resumo e explicação dos capítulos</p>
                <ReactMarkdown components={mdComponents}>{devotional.reflection}</ReactMarkdown>
              </div>
            )}
            {devotional.historical_context && (
              <div style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize: 11, color: S.copper, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 16, fontFamily: S.sans }}>Contexto histórico</p>
                <ReactMarkdown components={mdComponents}>{devotional.historical_context}</ReactMarkdown>
              </div>
            )}
            {devotional.youtube_search_terms && devotional.youtube_search_terms.length > 0 && (
              <div style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize: 11, color: S.copper, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 14, fontFamily: S.sans }}>Aprofunde-se</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {devotional.youtube_search_terms.map((term, i) => (
                    <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(term)}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: 12, background: S.bg, borderRadius: 10, padding: "13px 16px", textDecoration: "none", border: `1px solid ${S.border}` }}>
                      <span style={{ fontSize: 14, color: S.copper, flexShrink: 0 }}>▶</span>
                      <span style={{ fontSize: 13, color: "#4A4540", fontFamily: S.sans, lineHeight: 1.4 }}>{term}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {devotional.discussion_questions && devotional.discussion_questions.length > 0 && (
              <div style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize: 11, color: S.copper, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 16, fontFamily: S.sans }}>Para refletir</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {devotional.discussion_questions.map((q, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 14, borderBottom: i < devotional.discussion_questions!.length - 1 ? `1px solid ${S.border}` : "none" }}>
                      <span style={{ fontFamily: S.serif, fontSize: 13, fontWeight: 900, color: S.copper, flexShrink: 0, paddingTop: 1 }}>{i + 1}.</span>
                      <p style={{ fontFamily: S.sans, fontSize: 14, color: "#4A4540", lineHeight: 1.6 }}>{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Notes */}
            <div style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <p style={{ fontSize: 11, color: S.copper, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, fontFamily: S.sans }}>Anotações</p>
                {noteSaved && <span style={{ fontSize: 12, color: "#2E7D32", fontWeight: 600, fontFamily: S.sans }}>Salvo ✓</span>}
              </div>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Escreva suas reflexões ou insights sobre a leitura de hoje..."
                rows={4}
                style={{ width: "100%", background: S.bg, border: `1.5px solid ${S.border}`, borderRadius: 12, padding: "14px", fontSize: 14, color: S.ink, outline: "none", resize: "none", fontFamily: S.sans, lineHeight: 1.6 }}
              />
              <button
                onClick={saveNote}
                disabled={noteSaving || !noteText.trim()}
                style={{ marginTop: 10, width: "100%", background: noteText.trim() ? S.copper : S.border, color: noteText.trim() ? "#FFFFFF" : S.subtle, borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: S.sans, transition: "background 0.2s" }}
              >
                {noteSaving ? "Salvando..." : "Salvar anotação"}
              </button>
            </div>
          </>
        ) : devotional && !isPro ? (
          <div style={{ position: "relative" }}>
            <div style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}`, opacity: 0.25, pointerEvents: "none", userSelect: "none" }}>
              <p style={{ fontSize: 11, color: S.copper, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 10 }}>O que você leu</p>
              <p style={{ fontFamily: S.serif, fontSize: 15, color: S.ink, lineHeight: 1.7 }}>Explicação detalhada, contexto histórico, vídeos sugeridos e anotações pessoais...</p>
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <button
                onClick={() => router.push("/pro")}
                style={{ background: S.copper, color: "#FFFFFF", borderRadius: 14, padding: "14px 28px", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: S.sans, boxShadow: "0 8px 24px rgba(216,104,59,0.35)" }}
              >
                Desbloquear Pro
              </button>
            </div>
          </div>
        ) : null}

        {/* Mark as read */}
        <div style={{ marginTop: 4 }}>
          {completed ? (
            <div style={{ background: S.card, border: `1.5px solid #C8E6C9`, borderRadius: 16, padding: "20px", textAlign: "center" }}>
              <p style={{ fontFamily: S.serif, fontSize: 16, fontWeight: 700, color: "#2E7D32" }}>Lido hoje ✓</p>
              <p style={{ fontSize: 13, color: S.gray, marginTop: 4, fontFamily: S.sans }}>Continue amanhã!</p>
            </div>
          ) : (
            <button
              onClick={markAsRead}
              disabled={isPending}
              style={{ width: "100%", background: isPending ? S.border : S.copper, color: "#FFFFFF", borderRadius: 16, padding: "20px", fontFamily: S.serif, fontSize: 17, fontWeight: 900, border: "none", cursor: "pointer", letterSpacing: "-0.2px", boxShadow: isPending ? "none" : "0 6px 20px rgba(216,104,59,0.3)", transition: "background 0.2s" }}
            >
              {isPending ? "Salvando..." : "Li hoje"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
