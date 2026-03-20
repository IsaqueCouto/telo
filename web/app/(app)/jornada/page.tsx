import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PACE_DAYS, PACE_LABELS } from "@/lib/reading-plan";
import { FireIcon } from "@/components/icons";

const S = {
  bg:      "#F7F3EE",
  surface: "#EDE8DF",
  card:    "#FFFFFF",
  border:  "#E2DBD0",
  gray:    "#8C8279",
  muted:   "#C8BEB2",
  ink:     "#0D0D0B",
  blue:    "#3B82C4",
  serif:   "'Noto Sans', system-ui, sans-serif",
  sans:    "'Noto Sans', system-ui, sans-serif",
};

// 66 Bible books grouped by testament
const OLD_TESTAMENT = [
  "Gênesis","Êxodo","Levítico","Números","Deuteronômio",
  "Josué","Juízes","Rute","1 Samuel","2 Samuel",
  "1 Reis","2 Reis","1 Crônicas","2 Crônicas","Esdras",
  "Neemias","Ester","Jó","Salmos","Provérbios",
  "Eclesiastes","Cantares","Isaías","Jeremias","Lamentações",
  "Ezequiel","Daniel","Oseias","Joel","Amós",
  "Obadias","Jonas","Miquéias","Naum","Habacuque",
  "Sofonias","Ageu","Zacarias","Malaquias",
];
const NEW_TESTAMENT = [
  "Mateus","Marcos","Lucas","João","Atos",
  "Romanos","1 Coríntios","2 Coríntios","Gálatas","Efésios",
  "Filipenses","Colossenses","1 Tessalonicenses","2 Tessalonicenses","1 Timóteo",
  "2 Timóteo","Tito","Filemom","Hebreus","Tiago",
  "1 Pedro","2 Pedro","1 João","2 João","3 João",
  "Judas","Apocalipse",
];

export default async function JornadaPage() {
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

  // Ring SVG params
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;

  return (
    <div style={{ background: S.bg, minHeight: "100vh", fontFamily: S.sans }}>

      {/* Frosted glass header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(247,243,238,0.82)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(226,219,208,0.45)",
        padding: "calc(env(safe-area-inset-top) + 44px) 24px 18px",
      }}>
        <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 6, fontFamily: S.sans }}>Telos</p>
        <h1 style={{ fontFamily: S.serif, fontSize: 32, fontWeight: 900, color: S.ink, letterSpacing: "-0.8px", lineHeight: 1.1 }}>Sua jornada</h1>
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Completion ring + stats */}
        <div style={{ background: S.card, borderRadius: 24, padding: "28px 24px", border: `1px solid ${S.border}`, display: "flex", alignItems: "center", gap: 28 }}>
          {/* Ring */}
          <div style={{ flexShrink: 0 }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r={r} fill="none" stroke={S.surface} strokeWidth="10"/>
              <circle
                cx="65" cy="65" r={r} fill="none"
                stroke={S.blue} strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`}
                transform="rotate(-90 65 65)"
                style={{ transition: "stroke-dasharray 1s ease" }}
              />
              <text x="65" y="60" textAnchor="middle" fontFamily="'Noto Sans', sans-serif" fontSize="20" fontWeight="900" fill={S.blue}>{percent}%</text>
              <text x="65" y="78" textAnchor="middle" fontFamily="'Noto Sans', sans-serif" fontSize="9" fill={S.gray}>da Bíblia</text>
            </svg>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <p style={{ fontFamily: S.serif, fontSize: 28, fontWeight: 900, color: S.ink, letterSpacing: "-1px", lineHeight: 1 }}>{completed}</p>
              <p style={{ fontSize: 11, color: S.gray, marginTop: 2, fontFamily: S.sans }}>dias lidos</p>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <p style={{ fontFamily: S.serif, fontSize: 28, fontWeight: 900, color: S.blue, letterSpacing: "-1px", lineHeight: 1 }}>{streak?.current_streak ?? 0}</p>
                <FireIcon size={22} color="#E07A30" />
              </div>
              <p style={{ fontSize: 11, color: S.gray, marginTop: 2, fontFamily: S.sans }}>sequência atual</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: S.muted, fontFamily: S.sans }}>Plano de {paceLabel}</p>
              {remaining > 0 && <p style={{ fontSize: 11, color: S.muted, fontFamily: S.sans }}>{remaining} dias restantes</p>}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ background: S.card, borderRadius: 16, padding: "16px 20px", border: `1px solid ${S.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: S.gray, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: S.sans }}>Progresso geral</span>
            <span style={{ fontFamily: S.serif, fontSize: 13, fontWeight: 900, color: S.blue }}>{percent}% completo</span>
          </div>
          <div style={{ height: 5, background: S.surface, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${percent}%`, background: S.blue, borderRadius: 99 }} />
          </div>
          <p style={{ fontSize: 11, color: S.muted, marginTop: 8, fontFamily: S.sans }}>Plano de {paceLabel} · {completed} de {totalDays} dias</p>
        </div>

        {/* Bible book grid — Old Testament */}
        <div style={{ background: S.card, borderRadius: 20, padding: "20px", border: `1px solid ${S.border}` }}>
          <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 4, fontFamily: S.sans }}>Antigo Testamento</p>
          <p style={{ fontSize: 12, color: S.gray, marginBottom: 16, fontFamily: S.sans }}>39 livros</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
            {OLD_TESTAMENT.map((book) => (
              <div
                key={book}
                title={book}
                style={{
                  aspectRatio: "1",
                  borderRadius: 8,
                  background: S.surface,
                  border: `1px solid ${S.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 7, color: S.gray, fontFamily: S.sans, fontWeight: 600, textAlign: "center", lineHeight: 1.2, overflow: "hidden" }}>
                  {book.replace(/^\d+\s/, "").substring(0, 5)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bible book grid — New Testament */}
        <div style={{ background: S.card, borderRadius: 20, padding: "20px", border: `1px solid ${S.border}` }}>
          <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 4, fontFamily: S.sans }}>Novo Testamento</p>
          <p style={{ fontSize: 12, color: S.gray, marginBottom: 16, fontFamily: S.sans }}>27 livros</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
            {NEW_TESTAMENT.map((book) => (
              <div
                key={book}
                title={book}
                style={{
                  aspectRatio: "1",
                  borderRadius: 8,
                  background: S.surface,
                  border: `1px solid ${S.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 7, color: S.gray, fontFamily: S.sans, fontWeight: 600, textAlign: "center", lineHeight: 1.2 }}>
                  {book.replace(/^\d+\s/, "").substring(0, 5)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coming soon badge */}
        <div style={{ background: S.surface, borderRadius: 16, padding: "18px 20px", border: `1px solid ${S.border}`, textAlign: "center" as const }}>
          <p style={{ fontFamily: S.serif, fontSize: 15, fontWeight: 700, color: S.gray }}>Mais funcionalidades em breve</p>
          <p style={{ fontSize: 12, color: S.muted, marginTop: 4, fontFamily: S.sans }}>Mapa de capítulos, marcos e Wrapped anual</p>
        </div>

      </div>
    </div>
  );
}
