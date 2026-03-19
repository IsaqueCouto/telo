"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { PACE_LABELS } from "@/lib/reading-plan";

const S = {
  bg:      "#F7F3EE",
  card:    "#FFFFFF",
  border:  "#E2DBD0",
  gray:    "#8C8279",
  muted:   "#C8BEB2",
  ink:     "#0D0D0B",
  blue:    "#3B82C4",
  serif:   "'Vesper Libre', Georgia, serif",
  sans:    "'Noto Sans', system-ui, sans-serif",
};

export function ConfiguracoesClient({ profile, email }: { profile: Profile; email: string }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const rows = [
    { label: "Nome",            value: profile.full_name ?? "—" },
    { label: "E-mail",          value: email },
    { label: "Plano de leitura", value: PACE_LABELS[profile.pace as keyof typeof PACE_LABELS] ?? profile.pace },
  ];

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
        <h1 style={{ fontFamily: S.serif, fontSize: 32, fontWeight: 900, color: S.ink, letterSpacing: "-0.8px", lineHeight: 1.1 }}>Perfil</h1>
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Plan badge */}
        <div style={{ background: profile.plan_type === "pro" ? S.blue : S.card, borderRadius: 20, padding: "22px", border: `1px solid ${profile.plan_type === "pro" ? S.blue : S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div>
            <p style={{ fontSize: 11, color: profile.plan_type === "pro" ? "rgba(255,255,255,0.7)" : S.gray, textTransform: "uppercase" as const, letterSpacing: "0.07em", fontWeight: 600, marginBottom: 6, fontFamily: S.sans }}>Plano atual</p>
            <p style={{ fontFamily: S.serif, fontSize: 20, fontWeight: 900, color: profile.plan_type === "pro" ? "#FFFFFF" : S.ink }}>
              {profile.plan_type === "pro" ? "Telos Pro ✓" : "Gratuito"}
            </p>
          </div>
          {profile.plan_type !== "pro" && (
            <button
              onClick={() => router.push("/pro")}
              style={{ background: S.blue, color: "#FFFFFF", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.sans }}
            >
              Upgrade →
            </button>
          )}
        </div>

        {/* Info rows */}
        <div style={{ background: S.card, borderRadius: 20, border: `1px solid ${S.border}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          {rows.map((row, i) => (
            <div key={row.label} style={{ padding: "16px 20px", borderBottom: i < rows.length - 1 ? `1px solid ${S.border}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 14, color: S.gray, fontFamily: S.sans }}>{row.label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: S.ink, maxWidth: "60%", textAlign: "right" as const, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, fontFamily: S.sans }}>{row.value}</p>
            </div>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          style={{ width: "100%", background: "transparent", border: `1.5px solid ${S.border}`, color: "#C0392B", borderRadius: 14, padding: "15px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: S.sans }}
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}
