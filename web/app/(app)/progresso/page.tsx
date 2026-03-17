import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PACE_DAYS, PACE_LABELS } from "@/lib/reading-plan";

const S = { bg: "#010101", card: "#1C1C1C", border: "#2A2A2A", muted: "#3A3A3A", gray: "#6B6B6B", white: "#FFFFFF", orange: "#EB8530", gradient: "linear-gradient(135deg, #EB8530 0%, #E04724 100%)", font: "'Helvetica Neue', Helvetica, Arial, sans-serif" };

export default async function ProgressoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { count: completedCount }, { data: streak }] = await Promise.all([
    supabase.from("profiles").select("pace, plan_type").eq("id", user.id).single(),
    supabase.from("reading_progress").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("streaks").select("current_streak, longest_streak").eq("user_id", user.id).single(),
  ]);

  if (!profile) redirect("/login");

  const totalDays = PACE_DAYS[profile.pace as keyof typeof PACE_DAYS];
  const completed = completedCount ?? 0;
  const percent = Math.min(Math.round((completed / totalDays) * 100), 100);
  const paceLabel = PACE_LABELS[profile.pace as keyof typeof PACE_LABELS] ?? profile.pace;
  const remaining = totalDays - completed;

  return (
    <div style={{ padding: "0 20px 24px", background: S.bg, minHeight: "100vh", fontFamily: S.font }}>
      <div style={{ paddingTop: 56, paddingBottom: 28 }}>
        <p style={{ fontSize: 11, color: S.orange, textTransform: "uppercase" as const, letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Telo</p>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: S.white, letterSpacing: "-0.8px" }}>Seu progresso</h1>
      </div>

      <div style={{ background: S.card, borderRadius: 24, padding: "24px", marginBottom: 12, border: `1px solid ${S.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-2px", background: S.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>{percent}%</p>
            <p style={{ fontSize: 13, color: S.gray, marginTop: 4 }}>da Bíblia completa</p>
          </div>
          <div style={{ textAlign: "right" as const }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.white }}>{completed} dias lidos</p>
            <p style={{ fontSize: 11, color: S.gray }}>de {totalDays} no plano</p>
          </div>
        </div>
        <div style={{ height: 4, background: S.muted, borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${percent}%`, background: S.gradient, borderRadius: 99 }} />
        </div>
        <p style={{ fontSize: 12, color: S.gray, marginTop: 10 }}>Plano de {paceLabel}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        {[{ label: "Sequência atual", value: streak?.current_streak ?? 0, icon: "🔥" }, { label: "Maior sequência", value: streak?.longest_streak ?? 0, icon: "🏆" }].map((stat) => (
          <div key={stat.label} style={{ background: S.card, borderRadius: 20, padding: "20px", border: `1px solid ${S.border}`, textAlign: "center" as const }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
            <p style={{ fontSize: 36, fontWeight: 900, color: S.white, letterSpacing: "-1px" }}>{stat.value}</p>
            <p style={{ fontSize: 11, color: S.gray, marginTop: 4 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {remaining > 0 ? (
        <div style={{ background: S.card, borderRadius: 20, padding: "20px", border: `1px solid ${S.border}`, textAlign: "center" as const }}>
          <p style={{ fontSize: 13, color: S.gray, marginBottom: 6 }}>Faltam apenas</p>
          <p style={{ fontSize: 40, fontWeight: 900, color: S.white, letterSpacing: "-1.5px" }}>{remaining}</p>
          <p style={{ fontSize: 13, color: S.gray }}>dias para completar a Bíblia</p>
        </div>
      ) : (
        <div style={{ background: S.gradient, borderRadius: 20, padding: "24px", textAlign: "center" as const }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>👑</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: S.white }}>Você leu a Bíblia inteira!</p>
        </div>
      )}
    </div>
  );
}
