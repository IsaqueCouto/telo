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

function HorizonCalendar({ dayNumber, totalDays, completedToday, streak }: {
  dayNumber: number;
  totalDays: number;
  completedToday: boolean;
  streak: Streak | null;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const currentStreak = streak?.current_streak ?? 0;

  // Show 21 days: 7 before today through 13 after
  const days = Array.from({ length: 21 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 7 + i);
    const offset = i - 7; // negative = past, 0 = today, positive = future
    // A day is "completed" if it's today (and completedToday) or if it's within the streak window
    const isPast = offset < 0;
    const isToday = offset === 0;
    const isFuture = offset > 0;
    // Mark past days as completed based on streak
    const isCompleted = isToday
      ? completedToday
      : isPast && currentStreak > 0 && offset >= -(currentStreak - (completedToday ? 1 : 0));

    return {
      date: d.getDate(),
      weekday: WEEKDAYS_SHORT[d.getDay()],
      month: d.getMonth(),
      isToday,
      isPast,
      isFuture,
      isCompleted,
      key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
    };
  });

  // Scroll to center today on mount
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const todayEl = container.querySelector("[data-today='true']") as HTMLElement;
      if (todayEl) {
        const offset = todayEl.offsetLeft - container.clientWidth / 2 + todayEl.offsetWidth / 2;
        container.scrollLeft = offset;
      }
    }
  }, []);

  return (
    <div style={{ background: S.card, borderRadius: 20, padding: "18px 0 16px", border: `1px solid ${S.border}` }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", marginBottom: 16 }}>
        <p style={{ fontFamily: S.serif, fontSize: 15, fontWeight: 900, color: S.ink }}>
          {MONTHS[today.getMonth()]} {today.getFullYear()}
        </p>
        <p style={{ fontFamily: S.sans, fontSize: 11, color: S.gray, fontWeight: 500 }}>Dia {dayNumber} de {totalDays}</p>
      </div>

      {/* Scrollable days */}
      <div
        ref={scrollRef}
        className="no-scrollbar"
        style={{ display: "flex", gap: 4, overflowX: "auto", padding: "0 16px", scrollBehavior: "smooth" }}
      >
        {days.map((d) => (
          <div
            key={d.key}
            data-today={d.isToday}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
              padding: d.isToday ? "10px 6px 12px" : "10px 6px 12px",
              borderRadius: 14,
              background: d.isToday ? S.blue : "transparent",
              minWidth: d.isToday ? 44 : 38,
              transition: "background 0.2s",
            }}
          >
            {/* Weekday label */}
            <span style={{
              fontSize: 9,
              fontFamily: S.sans,
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
              color: d.isToday ? "rgba(255,255,255,0.75)" : d.isFuture ? S.muted : S.gray,
            }}>
              {d.weekday}
            </span>

            {/* Date number */}
            <span style={{
              fontFamily: S.serif,
              fontSize: d.isToday ? 18 : 15,
              fontWeight: 900,
              color: d.isToday ? "#FFFFFF" : d.isFuture ? S.muted : S.ink,
              lineHeight: 1,
            }}>
              {d.date}
            </span>

            {/* Completion dot */}
            <div style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: d.isToday
                ? (d.isCompleted ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)")
                : d.isCompleted
                  ? S.blue
                  : "transparent",
              transition: "background 0.2s",
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}

type Props = {
  profile: Profile;
  dayNumber: number;
  totalDays: number;
  devotional: Devotional | null;
  completedToday: boolean;
  streak: Streak | null;
  milestone: { emoji: string; message: string } | null;
};

export function HojeClient({ profile, dayNumber, totalDays, devotional, completedToday, streak, milestone }: Props) {
  const [currentStreak] = useState(streak?.current_streak ?? 0);
  const firstName = profile.full_name?.split(" ")[0] ?? "Olá";
  const percent   = Math.min(Math.round((dayNumber / totalDays) * 100), 100);

  return (
    <div style={{ background: S.bg, minHeight: "100vh", fontFamily: S.sans }}>

      {/* Frosted glass sticky header */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(247, 243, 238, 0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(226, 219, 208, 0.45)",
        padding: "calc(env(safe-area-inset-top) + 44px) 24px 18px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
      }}>
        <div>
          <p style={{ fontSize: 12, color: S.gray, marginBottom: 2, fontFamily: S.sans }}>Bom dia,</p>
          <p style={{ fontFamily: S.serif, fontSize: 26, fontWeight: 900, color: S.ink, letterSpacing: "-0.5px", lineHeight: 1 }}>{firstName}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(59,130,196,0.10)", border: "1px solid rgba(59,130,196,0.2)", borderRadius: 100, padding: "7px 13px" }}>
          <span style={{ fontSize: 14 }}>🔥</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: S.blue, fontFamily: S.sans }}>{currentStreak} {currentStreak === 1 ? "dia" : "dias"}</span>
        </div>
      </div>

      <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Horizon Calendar */}
        <HorizonCalendar dayNumber={dayNumber} totalDays={totalDays} completedToday={completedToday} streak={streak} />

        {/* Progress bar */}
        <div style={{ background: S.card, borderRadius: 16, padding: "16px 20px", border: `1px solid ${S.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: S.gray, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.07em", fontFamily: S.sans }}>Progresso total</span>
            <span style={{ fontFamily: S.serif, fontSize: 13, fontWeight: 900, color: S.blue }}>{percent}%</span>
          </div>
          <div style={{ height: 5, background: S.surface, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${percent}%`, background: S.blue, borderRadius: 99, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
          </div>
        </div>

        {/* Milestone */}
        {milestone && (
          <div style={{ background: S.blue, borderRadius: 16, padding: "18px 20px", textAlign: "center" as const }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>{milestone.emoji}</div>
            <p style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 15, fontFamily: S.serif }}>{milestone.message}</p>
          </div>
        )}

        {/* Today's reading */}
        <div style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}` }}>
          <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 10, fontFamily: S.sans }}>Leitura de hoje</p>
          {devotional ? (
            <>
              <p style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 900, color: S.ink, letterSpacing: "-0.5px", marginBottom: 16, lineHeight: 1.2 }}>
                {devotional.chapters_text}
              </p>
              <Link href="/leitura" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: S.blue, borderRadius: 12, padding: "14px", textDecoration: "none" }}>
                <span style={{ fontSize: 14 }}>📖</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", fontFamily: S.sans }}>Ler agora</span>
              </Link>
            </>
          ) : (
            <p style={{ fontSize: 14, color: S.gray, fontFamily: S.sans }}>Conteúdo sendo preparado para o dia {dayNumber}.</p>
          )}
        </div>

        {/* Key verse */}
        {devotional?.key_verse && (
          <div style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}` }}>
            <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 14, fontFamily: S.sans }}>Versículo do dia</p>
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

        {/* Read status */}
        {completedToday && (
          <div style={{ background: S.card, border: `1.5px solid #C8E6C9`, borderRadius: 16, padding: "20px", textAlign: "center" as const }}>
            <p style={{ fontFamily: S.serif, fontSize: 16, fontWeight: 700, color: "#2E7D32" }}>Lido hoje ✓</p>
            <p style={{ fontSize: 13, color: S.gray, marginTop: 4, fontFamily: S.sans }}>Continue amanhã!</p>
          </div>
        )}
      </div>
    </div>
  );
}
