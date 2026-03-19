import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PACE_DAYS, PACE_LABELS } from "@/lib/reading-plan";

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

  const totalDays  = PACE_DAYS[profile.pace as keyof typeof PACE_DAYS];
  const completed  = completedCount ?? 0;
  const percent    = Math.min(Math.round((completed / totalDays) * 100), 100);
  const paceLabel  = PACE_LABELS[profile.pace as keyof typeof PACE_LABELS] ?? profile.pace;
  const remaining  = totalDays - completed;

  return (
    <div style={{ background: S.bg, minHeight: "100vh", fontFamily: S.sans }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(247,243,238,0.82)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(226,219,208,0.45)",
        padding: "calc(env(safe-area-inset-top) + 44px) 24px 18px",
      }}>
        <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 6, fontFamily: S.sans }}>Telos</p>
        <h1 style={{ fontFamily: S.serif, fontSize: 32, fontWeight: 900, color: S.ink, letterSpacing: "-0.8px", lineHeight: 1.1 }}>Seu progresso</h1>
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Big progress card */}
        <div style={{ background: S.card, borderRadius: 24, padding: "28px", border: `1px solid ${S.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
            <div>
              <p style={{ fontFamily: S.serif, fontSize: 64, fontWeight: 900, color: S.blue, letterSpacing: "-3px", lineHeight: 1 }}>{percent}%</p>
              <p style={{ fontSize: 13, color: S.gray, marginTop: 6, fontFamily: S.sans }}>da Bíblia completa</p>
            </div>
            <div style={{ textAlign: "right" as const }}>
              <p style={{ fontFamily: S.serif, fontSize: 20, fontWeight: 900, color: S.ink }}>{completed}</p>
              <p style={{ fontSize: 12, color: S.gray, fontFamily: S.sans }}>dias lidos</p>
              <p style={{ fontFamily: S.serif, fontSize: 20, fontWeight: 900, color: S.ink, marginTop: 8 }}>{totalDays}</p>
              <p style={{ fontSize: 12, color: S.gray, fontFamily: S.sans }}>no plano</p>
            </div>
          </div>
          <div style={{ height: 5, background: S.surface, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${percent}%`, background: S.blue, borderRadius: 99 }} />
          </div>
          <p style={{ fontSize: 12, color: S.muted, marginTop: 10, fontFamily: S.sans }}>Plano de {paceLabel}</p>
        </div>

        {/* Streak stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Sequência atual", value: streak?.current_streak ?? 0, icon: "🔥" },
            { label: "Maior sequência", value: streak?.longest_streak ?? 0, icon: "🏆" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}`, textAlign: "center" as const, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{stat.icon}</div>
              <p style={{ fontFamily: S.serif, fontSize: 40, fontWeight: 900, color: S.ink, letterSpacing: "-1.5px" }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: S.gray, marginTop: 6, fontFamily: S.sans }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Remaining */}
        {remaining > 0 ? (
          <div style={{ background: S.card, borderRadius: 20, padding: "24px", border: `1px solid ${S.border}`, textAlign: "center" as const, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: 13, color: S.gray, marginBottom: 8, fontFamily: S.sans }}>Faltam apenas</p>
            <p style={{ fontFamily: S.serif, fontSize: 52, fontWeight: 900, color: S.blue, letterSpacing: "-2px" }}>{remaining}</p>
            <p style={{ fontSize: 13, color: S.gray, fontFamily: S.sans }}>dias para completar a Bíblia</p>
          </div>
        ) : (
          <div style={{ background: S.blue, borderRadius: 20, padding: "28px", textAlign: "center" as const }}>
            <p style={{ fontSize: 36, marginBottom: 10 }}>👑</p>
            <p style={{ fontFamily: S.serif, fontSize: 20, fontWeight: 900, color: "#FFFFFF" }}>Você leu a Bíblia inteira!</p>
          </div>
        )}
      </div>
    </div>
  );
}
