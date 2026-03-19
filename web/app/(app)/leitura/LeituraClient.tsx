"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/client";
import { BookOpenIcon, TempleIcon, PlayCircleIcon, MessageIcon, PencilIcon, LockIcon, SpeakerIcon, CheckCircleIcon } from "@/components/icons";
import type { BibleChapter, Translation } from "@/lib/bible";
import type { Devotional, Note, Streak } from "@/lib/types";

const S = {
  bg:      "#F7F3EE",
  surface: "#EDE8DF",
  card:    "#FFFFFF",
  border:  "#E2DBD0",
  gray:    "#8C8279",
  muted:   "#C8BEB2",
  ink:     "#0D0D0B",
  blue:    "#3B82C4",
  serif:   "'Vesper Libre', Georgia, serif",
  sans:    "'Noto Sans', system-ui, sans-serif",
};

const mdComponents = {
  h2: ({ children }: any) => <h2 style={{ fontFamily: S.serif, fontSize: 17, fontWeight: 900, color: S.ink, marginTop: 22, marginBottom: 8, letterSpacing: "-0.3px", lineHeight: 1.3 }}>{children}</h2>,
  h3: ({ children }: any) => <h3 style={{ fontFamily: S.serif, fontSize: 14, fontWeight: 700, color: S.blue, marginTop: 16, marginBottom: 6 }}>{children}</h3>,
  p: ({ children }: any) => <p style={{ fontFamily: S.sans, fontSize: 14, color: "#4A4540", lineHeight: 1.8, marginBottom: 10 }}>{children}</p>,
  ul: ({ children }: any) => <ul style={{ paddingLeft: 0, marginBottom: 10, listStyle: "none" }}>{children}</ul>,
  li: ({ children }: any) => (
    <li style={{ fontFamily: S.sans, fontSize: 14, color: "#4A4540", lineHeight: 1.7, marginBottom: 6, paddingLeft: 18, position: "relative" }}>
      <span style={{ position: "absolute", left: 0, color: S.blue, fontWeight: 700 }}>·</span>
      {children}
    </li>
  ),
  strong: ({ children }: any) => <strong style={{ color: S.ink, fontWeight: 700 }}>{children}</strong>,
};

function Accordion({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: S.card, borderRadius: 16, border: `1px solid ${S.border}`, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" as const }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
          <span style={{ fontFamily: S.sans, fontSize: 13, fontWeight: 700, color: S.ink }}>{label}</span>
        </div>
        <span style={{ fontSize: 12, color: S.gray, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: "0 20px 18px", borderTop: `1px solid ${S.border}`, paddingTop: 16 }}>
          {children}
        </div>
      )}
    </div>
  );
}

type SelectedVerse = { bookName: string; chapter: number; number: number; text: string };

type Props = {
  userId: string;
  dayNumber: number;
  chaptersText: string;
  chapters: BibleChapter[];
  initialTranslation: Translation;
  devotional: Devotional | null;
  isPro: boolean;
  existingNotes: Note[];
  completedToday: boolean;
  streak: Streak | null;
};

export function LeituraClient({ userId, dayNumber, chaptersText, chapters: initialChapters, initialTranslation, devotional, isPro, existingNotes, completedToday: initialCompleted, streak }: Props) {
  const router = useRouter();
  const [translation, setTranslation]     = useState<Translation>(initialTranslation);
  const [chapters, setChapters]           = useState<BibleChapter[]>(initialChapters);
  const [loading, setLoading]             = useState(false);
  const [completed, setCompleted]         = useState(initialCompleted);
  const [isPending, startTransition]      = useTransition();
  const [selectedVerse, setSelectedVerse] = useState<SelectedVerse | null>(null);
  const [verseNote, setVerseNote]         = useState("");
  const [savingNote, setSavingNote]       = useState(false);
  const [savedNote, setSavedNote]         = useState(false);
  const [generalNote, setGeneralNote]     = useState(() => existingNotes.find(n => !n.verse_reference)?.content ?? "");
  const [generalNoteId, setGeneralNoteId] = useState(() => existingNotes.find(n => !n.verse_reference)?.id ?? null);
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savedGeneral, setSavedGeneral]   = useState(false);
  const [highlightedVerses, setHighlightedVerses] = useState<Set<string>>(() => {
    const s = new Set<string>();
    existingNotes.filter(n => n.verse_reference).forEach(n => s.add(n.verse_reference!));
    return s;
  });

  function verseKey(v: SelectedVerse) {
    return `${v.bookName} ${v.chapter}:${v.number}`;
  }

  function handleVerseClick(v: SelectedVerse) {
    if (!isPro) return;
    const key = verseKey(v);
    const existing = existingNotes.find(n => n.verse_reference === key);
    setVerseNote(existing?.content ?? "");
    setSelectedVerse(v);
  }

  async function saveVerseNote() {
    if (!selectedVerse) return;
    setSavingNote(true);
    const supabase = createClient();
    const key = verseKey(selectedVerse);
    const existing = existingNotes.find(n => n.verse_reference === key);
    if (existing) {
      await supabase.from("notes").update({ content: verseNote, updated_at: new Date().toISOString() }).eq("id", existing.id);
    } else {
      await supabase.from("notes").insert({ user_id: userId, day_number: dayNumber, content: verseNote, verse_reference: key });
    }
    if (verseNote.trim()) {
      setHighlightedVerses(prev => new Set(prev).add(key));
    } else {
      setHighlightedVerses(prev => { const s = new Set(prev); s.delete(key); return s; });
    }
    setSavingNote(false);
    setSavedNote(true);
    setTimeout(() => { setSavedNote(false); setSelectedVerse(null); }, 1200);
  }

  async function saveGeneralNote() {
    if (!generalNote.trim()) return;
    setSavingGeneral(true);
    const supabase = createClient();
    if (generalNoteId) {
      await supabase.from("notes").update({ content: generalNote, updated_at: new Date().toISOString() }).eq("id", generalNoteId);
    } else {
      const { data } = await supabase.from("notes").insert({ user_id: userId, day_number: dayNumber, content: generalNote, verse_reference: null }).select("id").single();
      if (data) setGeneralNoteId(data.id);
    }
    setSavingGeneral(false);
    setSavedGeneral(true);
    setTimeout(() => setSavedGeneral(false), 2000);
  }

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
    setCompleted(true);
    startTransition(() => router.refresh());
  }

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
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(247,243,238,0.82)", backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", borderBottom: "1px solid rgba(226,219,208,0.45)", padding: "calc(env(safe-area-inset-top) + 10px) 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => router.back()} style={{ fontSize: 14, fontWeight: 600, color: S.gray, background: "none", border: "none", cursor: "pointer", fontFamily: S.sans, padding: 0 }}>
          ← Voltar
        </button>
        <p style={{ fontFamily: S.serif, fontSize: 14, fontWeight: 700, color: S.ink, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
          {chaptersText}
        </p>
        <div style={{ display: "flex", background: S.surface, borderRadius: 10, border: `1px solid ${S.border}`, overflow: "hidden" }}>
          {(["nvi", "acf"] as Translation[]).map((t) => (
            <button key={t} onClick={() => switchTranslation(t)} disabled={loading} style={{ padding: "7px 13px", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: S.sans, background: translation === t ? S.blue : "transparent", color: translation === t ? "#FFFFFF" : S.gray, letterSpacing: "0.04em", transition: "background 0.15s" }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Bible text */}
      <div style={{ padding: "28px 24px 32px", display: "flex", flexDirection: "column", gap: 48 }}>
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
          <>
            {chapters.map((ch) => (
              <div key={`${ch.bookName}-${ch.chapter}`}>
                <h2 style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 900, color: S.ink, letterSpacing: "-0.3px", marginBottom: 6, lineHeight: 1.2 }}>
                  {ch.bookName} {ch.chapter}
                </h2>
                <div style={{ width: 32, height: 2, background: S.blue, borderRadius: 99, marginBottom: 24 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {ch.verses.map((verse) => {
                    const key = `${ch.bookName} ${ch.chapter}:${verse.number}`;
                    const isHighlighted = highlightedVerses.has(key);
                    return (
                      <p
                        key={verse.number}
                        onClick={() => handleVerseClick({ bookName: ch.bookName, chapter: ch.chapter, number: verse.number, text: verse.text })}
                        style={{
                          fontFamily: S.serif, fontSize: 17, lineHeight: 1.9, color: "#3A3530",
                          cursor: isPro ? "pointer" : "default",
                          background: isHighlighted ? "#EBF3FA" : selectedVerse?.number === verse.number && selectedVerse?.chapter === ch.chapter ? "#EBF3FA" : "transparent",
                          borderRadius: 6, padding: "2px 4px", margin: "0 -4px",
                          transition: "background 0.15s",
                        }}
                      >
                        <sup style={{ fontSize: 10, fontWeight: 700, color: S.blue, marginRight: 4, verticalAlign: "super", fontFamily: S.sans }}>
                          {verse.number}
                        </sup>
                        {verse.text}
                        {isHighlighted && (
                          <span style={{ marginLeft: 4, display: "inline-flex", verticalAlign: "middle" }}><PencilIcon size={11} color={S.blue} /></span>
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Li hoje button */}
            <div>
              {completed ? (
                <div style={{ background: S.card, border: `1.5px solid #C8E6C9`, borderRadius: 16, padding: "18px 20px", textAlign: "center" as const }}>
                  <p style={{ fontFamily: S.serif, fontSize: 16, fontWeight: 700, color: "#2E7D32" }}>Lido hoje ✓</p>
                  <p style={{ fontSize: 13, color: S.gray, marginTop: 4 }}>Continue amanhã!</p>
                </div>
              ) : (
                <button onClick={markAsRead} disabled={isPending} style={{ width: "100%", background: isPending ? S.muted : S.blue, color: "#FFFFFF", borderRadius: 16, padding: "18px 20px", fontFamily: S.serif, fontSize: 17, fontWeight: 900, border: "none", cursor: "pointer", letterSpacing: "-0.2px", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <CheckCircleIcon size={18} color="#FFFFFF" />
                  {isPending ? "Salvando..." : "Li hoje"}
                </button>
              )}
            </div>

            {/* Pro sections */}
            {devotional && isPro && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ fontSize: 11, color: S.gray, textTransform: "uppercase" as const, letterSpacing: "0.1em", fontWeight: 600, marginBottom: 4 }}>Conteúdo Pro</p>

                {devotional.reflection && (
                  <Accordion label="O que você leu" icon={<BookOpenIcon size={15} color={S.gray} />}>
                    <ReactMarkdown components={mdComponents}>{devotional.reflection}</ReactMarkdown>
                  </Accordion>
                )}

                {devotional.historical_context && (
                  <Accordion label="Contexto histórico" icon={<TempleIcon size={15} color={S.gray} />}>
                    <ReactMarkdown components={mdComponents}>{devotional.historical_context}</ReactMarkdown>
                  </Accordion>
                )}

                {devotional.youtube_search_terms && devotional.youtube_search_terms.length > 0 && (
                  <Accordion label="Aprofunde-se" icon={<PlayCircleIcon size={15} color={S.gray} />}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {devotional.youtube_search_terms.map((term, i) => (
                        <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(term)}`} target="_blank" rel="noopener noreferrer"
                          style={{ display: "flex", alignItems: "center", gap: 10, background: S.surface, borderRadius: 10, padding: "12px 14px", textDecoration: "none" }}>
                          <PlayCircleIcon size={16} color={S.blue} />
                          <span style={{ fontSize: 13, color: "#4A4540", lineHeight: 1.4 }}>{term}</span>
                        </a>
                      ))}
                    </div>
                  </Accordion>
                )}

                {devotional.discussion_questions && devotional.discussion_questions.length > 0 && (
                  <Accordion label="Para refletir" icon={<MessageIcon size={15} color={S.gray} />}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {devotional.discussion_questions.map((q, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, paddingBottom: 12, borderBottom: i < devotional.discussion_questions!.length - 1 ? `1px solid ${S.border}` : "none" }}>
                          <span style={{ fontFamily: S.serif, fontSize: 13, fontWeight: 900, color: S.blue, flexShrink: 0 }}>{i + 1}.</span>
                          <p style={{ fontFamily: S.sans, fontSize: 14, color: "#4A4540", lineHeight: 1.6 }}>{q}</p>
                        </div>
                      ))}
                    </div>
                  </Accordion>
                )}

                <Accordion label="Anotações gerais" icon={<PencilIcon size={15} color={S.gray} />}>
                  <textarea
                    value={generalNote}
                    onChange={(e) => setGeneralNote(e.target.value)}
                    placeholder="Escreva suas reflexões sobre a leitura de hoje..."
                    rows={4}
                    style={{ width: "100%", background: S.surface, border: `1.5px solid ${S.border}`, borderRadius: 10, padding: "12px", fontSize: 14, color: S.ink, outline: "none", resize: "none", fontFamily: S.sans, lineHeight: 1.6 }}
                  />
                  <button
                    onClick={saveGeneralNote}
                    disabled={savingGeneral || !generalNote.trim()}
                    style={{ marginTop: 8, width: "100%", background: generalNote.trim() ? S.blue : S.border, color: generalNote.trim() ? "#FFFFFF" : S.muted, borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: S.sans }}
                  >
                    {savingGeneral ? "Salvando..." : savedGeneral ? "Salvo ✓" : "Salvar anotação"}
                  </button>
                </Accordion>
              </div>
            )}

            {devotional && !isPro && (
              <div style={{ position: "relative" }}>
                <div style={{ background: S.card, borderRadius: 16, padding: "20px", border: `1px solid ${S.border}`, opacity: 0.3, pointerEvents: "none", userSelect: "none" }}>
                  <p style={{ fontSize: 13, color: S.ink }}>O que você leu · Contexto histórico · Vídeos · Anotações...</p>
                </div>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <button onClick={() => router.push("/pro")} style={{ background: S.blue, color: "#FFFFFF", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: S.sans }}>
                    Desbloquear Pro
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(247,243,238,0.97)", borderTop: `1px solid ${S.border}`, padding: "10px 20px 28px", textAlign: "center" as const, backdropFilter: "blur(20px)" }}>
        {isPro && <p style={{ fontSize: 10, color: S.muted, marginBottom: 4 }}>Toque em um versículo para anotar</p>}
        <p style={{ fontSize: 11, color: S.muted }}>Dia {dayNumber} · {chaptersText} · {translation.toUpperCase()}</p>
      </div>

      {/* Verse note bottom sheet */}
      {selectedVerse && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedVerse(null); }}
        >
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} onClick={() => setSelectedVerse(null)} />
          <div style={{ position: "relative", background: S.card, borderRadius: "20px 20px 0 0", padding: "20px 24px 40px", maxWidth: 480, margin: "0 auto", width: "100%" }}>
            <div style={{ width: 36, height: 4, background: S.border, borderRadius: 99, margin: "0 auto 16px" }} />
            <p style={{ fontSize: 11, color: S.blue, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 8 }}>
              {selectedVerse.bookName} {selectedVerse.chapter}:{selectedVerse.number}
            </p>
            <p style={{ fontFamily: S.serif, fontSize: 14, color: "#4A4540", lineHeight: 1.7, fontStyle: "italic", marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${S.border}` }}>
              &ldquo;{selectedVerse.text}&rdquo;
            </p>
            <textarea
              autoFocus
              value={verseNote}
              onChange={(e) => setVerseNote(e.target.value)}
              placeholder="Sua anotação sobre este versículo..."
              rows={3}
              style={{ width: "100%", background: S.surface, border: `1.5px solid ${S.border}`, borderRadius: 10, padding: "12px", fontSize: 14, color: S.ink, outline: "none", resize: "none", fontFamily: S.sans, lineHeight: 1.6 }}
            />
            <button
              onClick={saveVerseNote}
              disabled={savingNote}
              style={{ marginTop: 10, width: "100%", background: S.blue, color: "#FFFFFF", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: S.sans }}
            >
              {savingNote ? "Salvando..." : savedNote ? "Salvo ✓" : "Salvar anotação"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
