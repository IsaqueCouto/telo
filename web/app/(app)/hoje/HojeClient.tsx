"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
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

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

function CalendarStrip({ dayNumber, totalDays }: { dayNumber: number; totalDays: number }) {
  const today = new Date();
  const dow = today.getDay();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - dow + i);
    return { label: WEEKDAYS[i], date: d.getDate(), isToday: i === dow };
  });

  return (
    <div style={{ background: S.card, borderRadius: 20, padding: "18px 20px", border: `1px solid ${S.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ fontFamily: S.serif, fontSize: 16, fontWeight: 900, color: S.ink }}>
          {MONTHS[today.getMonth()]} {today.getFullYear()}
        </p>
        <p style={{ fontFamily: S.sans, fontSize: 12, color: S.gray }}>Dia {dayNumber} de {totalDays}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {days.map((d, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 10, fontFamily: S.sans, color: d.isToday ? S.blue : S.muted, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>
              {d.label}
            </span>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: d.isToday ? S.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13, fontFamily: S.sans, fontWeight: d.isToday ? 700 : 400, color: d.isToday ? "#FFFFFF" : S.gray }}>
                {d.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type Props = {
  userId: string;
  profile: Profile;
  dayNumber: number;
  totalDays: number;
  devotional: Devotional | null;
  completedToday: boolean;
  streak: Streak | null;
  milestone: { emoji: string; message: string } | null;
};

export function HojeClient({ userId, profile, dayNumber, totalDays, devotional, completedToday: initialCompleted, streak, milestone }: Props) {
  const router = useRouter();
  const [completed, setCompleted]         = useState(initialCompleted);
  const [currentStreak, setCurrentStreak] = useState(streak?.current_streak ?? 0);
  const [isPending, startTransition]      = useTransition();

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

  const firstName = profile.full_name?.split(" ")[0] ?? "Olá";
  const percent   = Math.min(Math.round((dayNumber / totalDays) * 100), 100);

  return (
    <div style={{ background: S.bg, minHeight: "100vh", fontFamily: S.sans }}>

      {/* Header */}
      <div style={{ padding: "52px 24px 20px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 13, color: S.gray, marginBottom: 3 }}>Bom dia,</p>
          <p style={{ fontFamily: S.serif, fontSize: 28, fontWeight: 900, color: S.ink, letterSpacing: "-0.5px", lineHeight: 1 }}>{firstName}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: S.card, border: `1px solid ${S.border}`, borderRadius: 100, padding: "8px 14px" }}>
          <span style={{ fontSize: 15 }}>🔥</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: S.blue }}>{currentStreak} {currentStreak === 1 ? "dia" : "dias"}</span>
        </div>
      </div>

      <div style={{ padding: "0 24px 120px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Calendar */}
        <CalendarStrip dayNumber={dayNumber} totalDays={totalDays} />

        {/* Progress */}
        <div style={{ background: S.card, borderRadius: 16, padding: "16px 20px", border: `1px solid ${S.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: S.gray, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.07em" }}>Progresso</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: S.blue }}>{percent}% completo</span>
          </div>
          <div style={{ height: 6, background: S.surface, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${percent}%`, background: S.blue, borderRadius: 99, transition: "width 0.6s ease" }} />
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
          <p style={{ fontSize: 11, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.1em", fontWeight: 700, marginBottom: 10 }}>Leitura de hoje</p>
          {devotional ? (
            <>
              <p style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 900, color: S.ink, letterSpacing: "-0.5px", marginBottom: 16, lineHeight: 1.2 }}>
                {devotional.chapters_text}
              </p>
              <Link href="/leitura" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: S.blue, borderRadius: 12, padding: "14px", textDecoration: "none" }}>
                <span style={{ fontSize: 14 }}>📖</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>Ler agora</span>
              </Link>
            </>
          ) : (
            <p style={{ fontSize: 14, color: S.gray }}>Conteúdo sendo preparado para o dia {dayNumber}.</p>
          )}
        </div>

        {/* Key verse */}
        {devotional?.key_verse && (
          <div style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}` }}>
            <p style={{ fontSize: 11, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.1em", fontWeight: 700, marginBottom: 14 }}>Versículo do dia</p>
            <div style={{ borderLeft: `3px solid ${S.blue}`, paddingLeft: 16, marginBottom: 12 }}>
              <p style={{ fontFamily: S.serif, fontSize: 16, color: "#4A4540", lineHeight: 1.8, fontStyle: "italic" }}>
                &ldquo;{devotional.key_verse}&rdquo;
              </p>
            </div>
            {devotional.key_verse_reference && (
              <p style={{ fontSize: 12, color: S.blue, fontWeight: 700, textAlign: "right" as const }}>— {devotional.key_verse_reference}</p>
            )}
          </div>
        )}

        {/* Music placeholder */}
        <div style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}` }}>
          <p style={{ fontSize: 11, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.1em", fontWeight: 700, marginBottom: 14 }}>Música para hoje</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: S.surface, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: S.border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 16 }}>🎵</span>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: S.ink }}>Em breve</p>
              <p style={{ fontSize: 11, color: S.gray, marginTop: 2 }}>Recomendações musicais a caminho</p>
            </div>
          </div>
        </div>

        {/* Mark as read */}
        {completed ? (
          <div style={{ background: S.card, border: `1.5px solid #C8E6C9`, borderRadius: 16, padding: "20px", textAlign: "center" as const }}>
            <p style={{ fontFamily: S.serif, fontSize: 16, fontWeight: 700, color: "#2E7D32" }}>Lido hoje ✓</p>
            <p style={{ fontSize: 13, color: S.gray, marginTop: 4 }}>Continue amanhã!</p>
          </div>
        ) : (
          <button onClick={markAsRead} disabled={isPending} style={{ width: "100%", background: isPending ? S.border : S.blue, color: "#FFFFFF", borderRadius: 16, padding: "20px", fontFamily: S.serif, fontSize: 17, fontWeight: 900, border: "none", cursor: "pointer", letterSpacing: "-0.2px", transition: "background 0.2s" }}>
            {isPending ? "Salvando..." : "Li hoje"}
          </button>
        )}
      </div>
    </div>
  );
}
