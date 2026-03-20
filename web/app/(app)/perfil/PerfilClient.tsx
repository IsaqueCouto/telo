"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Streak } from "@/lib/types";
import { PACE_LABELS } from "@/lib/reading-plan";

const S = {
  bg:      "#F7F3EE",
  surface: "#EDE8DF",
  card:    "#FFFFFF",
  border:  "#E2DBD0",
  muted:   "#C8BEB2",
  gray:    "#8C8279",
  ink:     "#0D0D0B",
  blue:    "#3B82C4",
  green:   "#22C55E",
  amber:   "#F59E0B",
  serif:   "'Vesper Libre', Georgia, serif",
  sans:    "'Noto Sans', system-ui, sans-serif",
};

type Props = {
  profile: Profile;
  email: string;
  streak: Streak | null;
  totalChaptersRead: number;
  daysActive: number;
  heatmapDates: string[]; // ISO date strings of completed reading days (past 16 weeks)
};

// ── Heatmap ───────────────────────────────────────────────────────────────────

function Heatmap({ activeDates }: { activeDates: Set<string> }) {
  const today = new Date();
  // Build 16 weeks of days, ending today
  const days: { date: string; active: boolean }[] = [];
  for (let i = 111; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().split("T")[0];
    days.push({ date: iso, active: activeDates.has(iso) });
  }

  // Group into weeks
  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const MONTHS_PT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

  return (
    <div style={{ overflowX: "auto", paddingBottom: 4 }}>
      <div style={{ display: "flex", gap: 3, alignItems: "flex-start", minWidth: "fit-content" }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Month label on first day of month */}
            <div style={{ height: 14, fontSize: 9, color: S.muted, fontFamily: S.sans, textAlign: "center" }}>
              {week[0] && new Date(week[0].date + "T12:00:00").getDate() <= 7
                ? MONTHS_PT[new Date(week[0].date + "T12:00:00").getMonth()]
                : ""}
            </div>
            {week.map((day, di) => (
              <div
                key={di}
                title={day.date}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 2,
                  background: day.active ? S.blue : S.surface,
                  border: `1px solid ${day.active ? "rgba(59,130,196,0.3)" : S.border}`,
                  opacity: day.date > today.toISOString().split("T")[0] ? 0.3 : 1,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Notification section ──────────────────────────────────────────────────────

function NotificationSection({ profile }: { profile: Profile }) {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const notSupported = typeof window !== "undefined" && (!("Notification" in window) || !("serviceWorker" in navigator));

  useEffect(() => {
    if (notSupported) return;
    setPermission(Notification.permission);
    navigator.serviceWorker.register("/sw.js").then((reg) => {
      reg.pushManager.getSubscription().then((sub) => setSubscribed(!!sub));
    });
  }, [notSupported]);

  async function handleEnable() {
    if (notSupported) return;
    setLoading(true);
    setStatusMsg("");
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setStatusMsg("Permissão negada. Habilite nas configurações do navegador.");
        setLoading(false);
        return;
      }

      await navigator.serviceWorker.register("/sw.js");
      const reg = await navigator.serviceWorker.ready;

      const existing = await reg.pushManager.getSubscription();
      if (existing) {
        setSubscribed(true);
        setLoading(false);
        return;
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BD0qyVZ9SSmIY-NcbeqFDmLl7tg3li3MNwjemVHRnOpzaViJYyjg3PLBOlbsrKConF6buIjgb2iU7ruUyOmsNBc"
        ),
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });

      if (!res.ok) {
        setStatusMsg("Erro ao salvar inscrição. Tente novamente.");
      } else {
        setSubscribed(true);
      }
    } catch (e) {
      setStatusMsg(`Erro: ${(e as Error).message}`);
    }
    setLoading(false);
  }

  async function handleDisable() {
    setLoading(true);
    setStatusMsg("");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setSubscribed(false);
    } catch (e) {
      setStatusMsg(`Erro: ${(e as Error).message}`);
    }
    setLoading(false);
  }

  return (
    <div style={{ background: S.card, borderRadius: 20, border: `1px solid ${S.border}`, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: S.ink, fontFamily: S.sans, marginBottom: 2 }}>Notificações diárias</p>
          <p style={{ fontSize: 12, color: S.gray, fontFamily: S.sans, lineHeight: 1.4 }}>
            {subscribed
              ? "Você receberá um lembrete às 9h com o versículo do dia."
              : "Receba um lembrete diário com o versículo e sua sequência."}
          </p>
        </div>
        <div style={{
          width: 44, height: 26, borderRadius: 13,
          background: subscribed ? S.blue : S.surface,
          border: `1.5px solid ${subscribed ? S.blue : S.border}`,
          cursor: notSupported ? "not-allowed" : "pointer",
          transition: "background 0.2s, border 0.2s",
          position: "relative",
          flexShrink: 0,
          opacity: loading ? 0.6 : 1,
        }} onClick={subscribed ? handleDisable : handleEnable}>
          <div style={{
            position: "absolute",
            top: 3, left: subscribed ? 20 : 3,
            width: 18, height: 18,
            borderRadius: "50%",
            background: "#FFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            transition: "left 0.2s",
          }} />
        </div>
      </div>

      {statusMsg && (
        <p style={{ fontSize: 11, color: "#C0392B", fontFamily: S.sans, background: "#FEF2F2", borderRadius: 8, padding: "8px 12px", marginBottom: 8 }}>
          {statusMsg}
        </p>
      )}

      {permission === "denied" && (
        <p style={{ fontSize: 11, color: "#C0392B", fontFamily: S.sans, background: "#FEF2F2", borderRadius: 8, padding: "8px 12px" }}>
          Notificações bloqueadas no seu navegador. Vá em Configurações → Privacidade → Notificações para habilitar.
        </p>
      )}

      {notSupported && (
        <p style={{ fontSize: 11, color: S.gray, fontFamily: S.sans }}>
          Notificações não são suportadas neste navegador. Adicione o Telos à tela inicial para ativar.
        </p>
      )}

      <div style={{ marginTop: 12, padding: "10px 14px", background: S.surface, borderRadius: 10, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 18 }}>💡</span>
        <p style={{ fontSize: 11, color: S.gray, fontFamily: S.sans, lineHeight: 1.5 }}>
          No iPhone, adicione o Telos à tela inicial primeiro. Abra no Safari → compartilhar → "Adicionar à Tela de Início" → então ative as notificações aqui.
        </p>
      </div>
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0))).buffer;
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ value, label, emoji }: { value: string | number; label: string; emoji: string }) {
  return (
    <div style={{
      background: S.card, borderRadius: 16, border: `1px solid ${S.border}`,
      padding: "16px 12px", textAlign: "center", flex: 1,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <p style={{ fontSize: 20, marginBottom: 4 }}>{emoji}</p>
      <p style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 900, color: S.ink, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 10, color: S.gray, fontFamily: S.sans, marginTop: 4, lineHeight: 1.3 }}>{label}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function PerfilClient({ profile, email, streak, totalChaptersRead, daysActive, heatmapDates }: Props) {
  const router = useRouter();
  const activeDates = new Set(heatmapDates);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const rows = [
    { label: "Nome",             value: profile.full_name ?? "—" },
    { label: "E-mail",           value: email },
    { label: "Plano de leitura", value: PACE_LABELS[profile.pace as keyof typeof PACE_LABELS] ?? profile.pace },
    { label: "Tradução",         value: profile.bible_translation?.toUpperCase() ?? "NVI" },
  ];

  return (
    <div style={{ background: S.bg, minHeight: "100vh", fontFamily: S.sans, paddingBottom: 120 }}>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(247,243,238,0.82)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(226,219,208,0.45)",
        padding: "calc(env(safe-area-inset-top) + 44px) 24px 18px",
      }}>
        <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 6 }}>Telos</p>
        <h1 style={{ fontFamily: S.serif, fontSize: 32, fontWeight: 900, color: S.ink, letterSpacing: "-0.8px", lineHeight: 1.1 }}>Perfil</h1>
      </div>

      <div style={{ padding: "20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Plan badge */}
        <div style={{
          background: profile.plan_type === "pro" ? S.blue : S.card,
          borderRadius: 20, padding: "20px",
          border: `1px solid ${profile.plan_type === "pro" ? S.blue : S.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}>
          <div>
            <p style={{ fontSize: 11, color: profile.plan_type === "pro" ? "rgba(255,255,255,0.7)" : S.gray, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginBottom: 4 }}>Plano atual</p>
            <p style={{ fontFamily: S.serif, fontSize: 20, fontWeight: 900, color: profile.plan_type === "pro" ? "#FFF" : S.ink }}>
              {profile.plan_type === "pro" ? "Telos Pro ✓" : "Gratuito"}
            </p>
          </div>
          {profile.plan_type !== "pro" && (
            <button
              onClick={() => router.push("/pro")}
              style={{ background: S.blue, color: "#FFF", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              Upgrade →
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10 }}>
          <StatCard value={streak?.current_streak ?? 0} label="Sequência atual" emoji="🔥" />
          <StatCard value={streak?.longest_streak ?? 0} label="Maior sequência" emoji="🏆" />
          <StatCard value={totalChaptersRead} label="Capítulos lidos" emoji="📖" />
          <StatCard value={daysActive} label="Dias ativos" emoji="📅" />
        </div>

        {/* Heatmap */}
        <div style={{ background: S.card, borderRadius: 20, border: `1px solid ${S.border}`, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: S.ink, fontFamily: S.sans, marginBottom: 12 }}>Histórico de leitura</p>
          <Heatmap activeDates={activeDates} />
          <p style={{ fontSize: 10, color: S.muted, fontFamily: S.sans, marginTop: 10 }}>Últimas 16 semanas</p>
        </div>

        {/* Notifications */}
        <NotificationSection profile={profile} />

        {/* Account info */}
        <div style={{ background: S.card, borderRadius: 20, border: `1px solid ${S.border}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          {rows.map((row, i) => (
            <div key={row.label} style={{
              padding: "15px 20px",
              borderBottom: i < rows.length - 1 ? `1px solid ${S.border}` : "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <p style={{ fontSize: 14, color: S.gray }}>{row.label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: S.ink, maxWidth: "60%", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.value}</p>
            </div>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          style={{ width: "100%", background: "transparent", border: `1.5px solid ${S.border}`, color: "#C0392B", borderRadius: 14, padding: "15px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}
