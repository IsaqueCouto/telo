"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { Profile, Devotional, Streak } from "@/lib/types";

const S = {
  bg:      "#F7F3EE",
  surface: "#EDE8DF",
  card:    "#FFFFFF",
  border:  "#E2DBD0",
  muted:   "#C8BEB2",
  gray:    "#8C8279",
  ink:     "#0D0D0B",
  blue:    "#3B82C4",
  serif:   "'Vesper Libre', Georgia, serif",
  sans:    "'Noto Sans', system-ui, sans-serif",
};

const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const MOODS = [
  { id: "ansioso", label: "Ansioso", verse: "Filipenses 4:6-7", text: "Não andeis ansiosos por coisa alguma; antes em tudo fazei os vossos pedidos conhecidos a Deus por meio de oração e súplica.", reflection: "A ansiedade muitas vezes nos faz esquecer que não estamos sozinhos. Deus conhece cada preocupação que você carrega hoje — não precisa carregá-las sozinho. Entregue ao Senhor o que você não consegue resolver, e receba a paz que ultrapassa todo entendimento." },
  { id: "triste",  label: "Triste",  verse: "Salmo 34:18", text: "Perto está o Senhor dos que têm o coração quebrantado e salva os de espírito abatido.", reflection: "Sentir tristeza não é fraqueza — é humano. Deus não se afasta de corações feridos; Ele se aproxima. Você não precisa fingir que está bem; Ele te encontra exatamente onde você está." },
  { id: "grato",   label: "Grato",   verse: "Salmo 100:4", text: "Entrai nos seus átrios com ações de graças, nos seus átrios com hinos. Rendei-lhe graças e bendizei o seu nome.", reflection: "Gratidão é um ato de fé — é reconhecer que as bênçãos não são coincidência. Que hoje você carregue essa leveza no coração, sabendo que as boas dádivas vêm d'Ele." },
  { id: "perdido", label: "Perdido", verse: "Jeremias 29:11", text: "Porque eu bem sei os planos que tenho para vós, diz o Senhor, planos de paz e não de mal, para vos dar um futuro e uma esperança.", reflection: "Quando não sabemos o caminho, é fácil achar que Deus também não sabe. Mas Ele não apenas conhece o caminho — Ele é o caminho. Confie nos planos dEle mesmo quando você não os entende ainda." },
  { id: "cansado", label: "Cansado", verse: "Mateus 11:28", text: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.", reflection: "O cansaço que você sente hoje é real, e Deus o vê. Jesus não pede que você chegue com força — Ele convida exatamente os que estão esgotados. Descanse nEle hoje." },
];

// ── Mood SVG icons (neumorphic line-art style) ───────────────────────────────

function AnsisoIcon({ active }: { active: boolean }) {
  const c = active ? "#FFF8EE" : "#A0855C";
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path d="M2 17 L5 17 L7 11 L9 23 L11 13 L13 21 L15 8 L17 26 L19 14 L21 20 L23 17 L27 17 L32 17"
        stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function TristeIcon({ active }: { active: boolean }) {
  const c = active ? "#FFF8EE" : "#A0855C";
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path d="M9 20 Q8 14 13 13 Q13 8 17 8 Q22 8 22 13 Q26 13 26 18 Q26 21 22 21 L11 21 Q8 21 9 20Z"
        stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <line x1="12" y1="24" x2="11" y2="28" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="17" y1="24" x2="16" y2="28" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="22" y1="24" x2="21" y2="28" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function GratoIcon({ active }: { active: boolean }) {
  const c = active ? "#FFF8EE" : "#A0855C";
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <line x1="3" y1="24" x2="31" y2="24" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M10 24 A7 7 0 0 1 24 24" stroke={c} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      <line x1="17" y1="7" x2="17" y2="11" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="8"  y1="13" x2="11" y2="15" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="26" y1="13" x2="23" y2="15" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="5"  y1="21" x2="8"  y2="21" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="29" y1="21" x2="26" y2="21" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function PerdidoIcon({ active }: { active: boolean }) {
  const c = active ? "#FFF8EE" : "#A0855C";
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="12" stroke={c} strokeWidth="1.6"/>
      <circle cx="17" cy="17" r="1.8" fill={c}/>
      <polygon points="17,6 14.5,15 17,13 19.5,15" fill={c}/>
      <polygon points="17,28 14.5,19 17,21 19.5,19" stroke={c} strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
      <line x1="17" y1="6"  x2="17" y2="9"  stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="17" y1="25" x2="17" y2="28" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="6"  y1="17" x2="9"  y2="17" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="28" y1="17" x2="25" y2="17" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function CansadoIcon({ active }: { active: boolean }) {
  const c = active ? "#FFF8EE" : "#A0855C";
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <polyline points="3,27 3,22 9,22 9,17 15,17 15,12 21,12 21,7 27,7"
        stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <polyline points="24,4 27,7 24,10"
        stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const MOOD_ICONS: Record<string, (props: { active: boolean }) => JSX.Element> = {
  ansioso: AnsisoIcon,
  triste:  TristeIcon,
  grato:   GratoIcon,
  perdido: PerdidoIcon,
  cansado: CansadoIcon,
};

// ── Horizon Calendar ────────────────────────────────────────────────────────

function HorizonCalendar({ dayNumber, totalDays, completedToday, streak }: {
  dayNumber: number;
  totalDays: number;
  completedToday: boolean;
  streak: Streak | null;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const currentStreak = streak?.current_streak ?? 0;

  const days = Array.from({ length: 21 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 7 + i);
    const offset = i - 7;
    const isToday = offset === 0;
    const isPast  = offset < 0;
    const isCompleted = isToday
      ? completedToday
      : isPast && currentStreak > 0 && offset >= -(currentStreak - (completedToday ? 1 : 0));
    return {
      date: d.getDate(),
      weekday: WEEKDAYS_SHORT[d.getDay()],
      isToday,
      isPast,
      isFuture: offset > 0,
      isCompleted,
      key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
    };
  });

  useEffect(() => {
    if (scrollRef.current) {
      const c = scrollRef.current;
      const el = c.querySelector("[data-today='true']") as HTMLElement;
      if (el) c.scrollLeft = el.offsetLeft - c.clientWidth / 2 + el.offsetWidth / 2;
    }
  }, []);

  return (
    <div style={{ background: S.card, borderRadius: 20, padding: "18px 0 16px", border: `1px solid ${S.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", marginBottom: 16 }}>
        <p style={{ fontFamily: S.serif, fontSize: 15, fontWeight: 900, color: S.ink }}>
          {MONTHS[today.getMonth()]} {today.getFullYear()}
        </p>
        <p style={{ fontFamily: S.sans, fontSize: 11, color: S.gray, fontWeight: 500 }}>Dia {dayNumber} de {totalDays}</p>
      </div>
      <div ref={scrollRef} className="no-scrollbar" style={{ display: "flex", gap: 4, overflowX: "auto", padding: "0 16px", scrollBehavior: "smooth" }}>
        {days.map((d) => (
          <div
            key={d.key}
            data-today={d.isToday}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              flexShrink: 0, padding: "10px 6px 12px", borderRadius: 14,
              background: d.isToday ? S.blue : "transparent",
              minWidth: d.isToday ? 44 : 38,
            }}
          >
            <span style={{ fontSize: 9, fontFamily: S.sans, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: d.isToday ? "rgba(255,255,255,0.75)" : d.isFuture ? S.muted : S.gray }}>
              {d.weekday}
            </span>
            <span style={{ fontFamily: S.serif, fontSize: d.isToday ? 18 : 15, fontWeight: 900, color: d.isToday ? "#FFFFFF" : d.isFuture ? S.muted : S.ink, lineHeight: 1 }}>
              {d.date}
            </span>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: d.isToday ? (d.isCompleted ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)") : d.isCompleted ? S.blue : "transparent" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Streak bar with book progress ────────────────────────────────────────────

function StreakBar({ streak, currentBook, bookStart, bookEnd, dayNumber }: {
  streak: Streak | null;
  currentBook: string | null;
  bookStart: number;
  bookEnd: number;
  dayNumber: number;
}) {
  const current   = streak?.current_streak ?? 0;
  const bookTotal = Math.max(bookEnd - bookStart + 1, 1);
  const bookDone  = Math.min(dayNumber - bookStart + 1, bookTotal);
  const bookLeft  = Math.max(bookEnd - dayNumber, 0);
  const pct       = Math.round((bookDone / bookTotal) * 100);

  return (
    <div style={{ background: S.card, borderRadius: 16, padding: "14px 18px", border: `1px solid ${S.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🔥</span>
          <span style={{ fontFamily: S.serif, fontSize: 20, fontWeight: 900, color: S.ink }}>{current}</span>
          <span style={{ fontSize: 12, color: S.gray, fontFamily: S.sans }}>{current === 1 ? "dia" : "dias"}</span>
        </div>
        {currentBook && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 11, color: S.gray, fontFamily: S.sans }}>{currentBook}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: S.blue, fontFamily: S.sans }}>{pct}%</span>
          </div>
        )}
      </div>
      <div style={{ height: 5, background: S.surface, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${S.blue}, #5B9BD5)`, borderRadius: 99, transition: "width 0.8s ease" }} />
      </div>
      {currentBook && (
        <p style={{ fontSize: 10, color: S.muted, marginTop: 6, fontFamily: S.sans }}>
          📖 {currentBook} — {bookLeft === 0 ? "último dia!" : `${bookLeft} ${bookLeft === 1 ? "dia restante" : "dias restantes"}`}
        </p>
      )}
    </div>
  );
}

// ── Mood selector ────────────────────────────────────────────────────────────

function MoodSelector() {
  const [selected, setSelected] = useState<string | null>(null);
  const mood = MOODS.find(m => m.id === selected);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: S.card, borderRadius: 20, padding: "20px 20px 20px", border: `1px solid ${S.border}` }}>
        <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 4, fontFamily: S.sans }}>Como você está hoje?</p>
        <p style={{ fontFamily: S.serif, fontSize: 15, fontWeight: 700, color: S.ink, marginBottom: 20 }}>Selecione seu estado de espírito</p>

        {/* 5 neumorphic tiles */}
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          {MOODS.map((m) => {
            const isActive = selected === m.id;
            const Icon = MOOD_ICONS[m.id];
            return (
              <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                <button
                  onClick={() => setSelected(isActive ? null : m.id)}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: 16,
                    background: isActive ? "#C49A3C" : "#F0EAE0",
                    boxShadow: isActive
                      ? "inset 2px 2px 6px rgba(0,0,0,0.18), inset -1px -1px 3px rgba(255,255,255,0.08)"
                      : "4px 4px 10px rgba(0,0,0,0.09), -2px -2px 6px rgba(255,255,255,0.85), inset 0 1px 0 rgba(255,255,255,0.7)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                  }}
                >
                  <Icon active={isActive} />
                </button>
                <span style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#C49A3C" : S.gray,
                  fontFamily: S.sans,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase" as const,
                }}>
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {mood && (
        <div style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}`, animation: "fadeSlideIn 0.22s ease" }}>
          <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 14, fontFamily: S.sans }}>Palavra para você</p>
          <div style={{ borderLeft: `3px solid ${S.blue}`, paddingLeft: 16, marginBottom: 12 }}>
            <p style={{ fontFamily: S.serif, fontSize: 16, color: "#4A4540", lineHeight: 1.85, fontStyle: "italic" }}>
              &ldquo;{mood.text}&rdquo;
            </p>
          </div>
          <p style={{ fontSize: 11, color: S.blue, fontWeight: 700, textAlign: "right" as const, marginBottom: 16, fontFamily: S.sans }}>— {mood.verse}</p>
          <p style={{ fontSize: 14, color: "#4A4540", lineHeight: 1.8, fontFamily: S.sans, marginBottom: 16 }}>{mood.reflection}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={async () => {
                const text = `"${mood.text}" — ${mood.verse}\n\nTelos · Leia a Bíblia inteira.`;
                if (navigator.share) { await navigator.share({ text }); }
                else { window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank"); }
              }}
              style={{ flex: 1, background: S.surface, border: `1px solid ${S.border}`, borderRadius: 12, padding: "11px", fontSize: 13, fontWeight: 600, color: S.gray, cursor: "pointer", fontFamily: S.sans }}
            >
              Compartilhar
            </button>
            <button style={{ flex: 1, background: S.surface, border: `1px solid ${S.border}`, borderRadius: 12, padding: "11px", fontSize: 13, fontWeight: 600, color: S.muted, cursor: "pointer", fontFamily: S.sans }}>
              🔒 Ouvir (Pro)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Devocionário ─────────────────────────────────────────────────────────────

function Devocional({ reflection, isPro }: { reflection: string | null | undefined; isPro: boolean }) {
  const [expanded, setExpanded] = useState(false);

  if (!reflection) return null;

  const words = reflection.split(" ");
  const isLong = words.length > 60;
  const preview = isLong && !expanded ? words.slice(0, 60).join(" ") + "…" : reflection;

  return (
    <div style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}` }}>
      <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 14, fontFamily: S.sans }}>Devocionário</p>

      <div style={{ fontFamily: S.serif, fontSize: 16, color: "#4A4540", lineHeight: 1.85 }}>
        {preview.split("\n").filter(Boolean).map((line, i) => (
          <p key={i} style={{ marginBottom: 10 }}>{line}</p>
        ))}
      </div>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ background: "none", border: "none", color: S.blue, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: S.sans, padding: 0, marginTop: 4 }}
        >
          {expanded ? "Mostrar menos" : "Ler tudo"}
        </button>
      )}

      <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${S.border}`, display: "flex", gap: 8 }}>
        {isPro ? (
          <button style={{ flex: 1, background: S.blue, color: "#FFFFFF", border: "none", borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.sans }}>
            ▶ Ouvir devocional
          </button>
        ) : (
          <button style={{ flex: 1, background: S.surface, border: `1px solid ${S.border}`, borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 600, color: S.muted, cursor: "pointer", fontFamily: S.sans }}>
            🔒 Ouvir em português (Pro)
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Props = {
  profile: Profile;
  dayNumber: number;
  totalDays: number;
  devotional: Devotional | null;
  completedToday: boolean;
  streak: Streak | null;
  milestone: { emoji: string; message: string } | null;
  currentBook: string | null;
  bookStart: number;
  bookEnd: number;
};

export function HojeClient({ profile, dayNumber, totalDays, devotional, completedToday, streak, milestone, currentBook, bookStart, bookEnd }: Props) {
  const firstName = profile.full_name?.split(" ")[0] ?? "Olá";
  const isPro     = profile.plan_type === "pro";

  async function shareVerse() {
    if (!devotional?.key_verse) return;
    const text = `"${devotional.key_verse}" — ${devotional.key_verse_reference ?? ""}\n\nTelos · Leia a Bíblia inteira.`;
    if (navigator.share) { await navigator.share({ text }); }
    else { window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank"); }
  }

  return (
    <div style={{ background: S.bg, minHeight: "100vh", fontFamily: S.sans }}>

      {/* Frosted glass sticky header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(247, 243, 238, 0.82)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(226, 219, 208, 0.45)",
        padding: "calc(env(safe-area-inset-top) + 44px) 24px 18px",
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ fontSize: 12, color: S.gray, marginBottom: 2, fontFamily: S.sans }}>Bom dia,</p>
          <p style={{ fontFamily: S.serif, fontSize: 26, fontWeight: 900, color: S.ink, letterSpacing: "-0.5px", lineHeight: 1 }}>{firstName}</p>
        </div>
        {completedToday && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(46,125,50,0.10)", border: "1px solid rgba(46,125,50,0.25)", borderRadius: 100, padding: "7px 13px" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#2E7D32", fontFamily: S.sans }}>Lido ✓</span>
          </div>
        )}
      </div>

      <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* 1. Streak bar with book progress */}
        <StreakBar streak={streak} currentBook={currentBook} bookStart={bookStart} bookEnd={bookEnd} dayNumber={dayNumber} />

        {/* Calendar */}
        <HorizonCalendar dayNumber={dayNumber} totalDays={totalDays} completedToday={completedToday} streak={streak} />

        {/* Milestone banner */}
        {milestone && (
          <div style={{ background: S.blue, borderRadius: 16, padding: "18px 20px", textAlign: "center" as const }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>{milestone.emoji}</div>
            <p style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 15, fontFamily: S.serif }}>{milestone.message}</p>
          </div>
        )}

        {/* 2. Leitura de hoje */}
        <div style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}` }}>
          <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 10, fontFamily: S.sans }}>Leitura de hoje</p>
          {devotional ? (
            <>
              <p style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 900, color: S.ink, letterSpacing: "-0.5px", marginBottom: 16, lineHeight: 1.2 }}>
                {devotional.chapters_text}
              </p>
              <Link href="/leitura" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: completedToday ? S.surface : S.blue, borderRadius: 12, padding: "14px", textDecoration: "none", border: completedToday ? `1px solid ${S.border}` : "none" }}>
                <span style={{ fontSize: 14 }}>📖</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: completedToday ? S.gray : "#FFFFFF", fontFamily: S.sans }}>
                  {completedToday ? "Reler" : "Ler agora"}
                </span>
              </Link>
            </>
          ) : (
            <p style={{ fontSize: 14, color: S.gray, fontFamily: S.sans }}>Conteúdo sendo preparado para o dia {dayNumber}.</p>
          )}
        </div>

        {/* ── After reading done: unlock sections ─────────────────────────── */}
        {completedToday && (
          <>
            {/* 3. Devocionário */}
            <Devocional reflection={devotional?.reflection} isPro={isPro} />

            {/* 4. Mood selector */}
            <MoodSelector />
          </>
        )}

        {/* 5. Versículo do dia — always visible */}
        {devotional?.key_verse && (
          <div style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, fontFamily: S.sans }}>Versículo do dia</p>
              <button
                onClick={shareVerse}
                style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(59,130,196,0.10)", border: "1px solid rgba(59,130,196,0.2)", borderRadius: 99, padding: "6px 12px", cursor: "pointer", color: S.blue, fontSize: 11, fontWeight: 700, fontFamily: S.sans }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Compartilhar
              </button>
            </div>
            <div style={{ borderLeft: `3px solid ${S.blue}`, paddingLeft: 16, marginBottom: 12 }}>
              <p style={{ fontFamily: S.serif, fontSize: 16, color: "#4A4540", lineHeight: 1.85, fontStyle: "italic" }}>
                &ldquo;{devotional.key_verse}&rdquo;
              </p>
            </div>
            {devotional.key_verse_reference && (
              <p style={{ fontSize: 11, color: S.blue, fontWeight: 700, textAlign: "right" as const, fontFamily: S.sans }}>— {devotional.key_verse_reference}</p>
            )}
          </div>
        )}

        {/* Music placeholder */}
        <div style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}` }}>
          <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 14, fontFamily: S.sans }}>Música para hoje</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: S.surface, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: S.border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 16 }}>🎵</span>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: S.ink, fontFamily: S.sans }}>Em breve</p>
              <p style={{ fontSize: 11, color: S.gray, marginTop: 2, fontFamily: S.sans }}>Recomendações musicais a caminho</p>
            </div>
          </div>
        </div>

        {/* Teaser when not yet read */}
        {!completedToday && devotional?.reflection && (
          <div style={{ background: S.surface, borderRadius: 16, padding: "16px 20px", border: `1px solid ${S.border}`, textAlign: "center" as const }}>
            <p style={{ fontSize: 13, color: S.gray, fontFamily: S.sans }}>
              📖 Conclua a leitura de hoje para desbloquear o devocionário e mais conteúdo
            </p>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
