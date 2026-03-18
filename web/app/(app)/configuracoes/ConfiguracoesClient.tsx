"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { PACE_LABELS } from "@/lib/reading-plan";

const S = { bg: "#010101", card: "#1C1C1C", border: "#2A2A2A", surface: "#141414", gray: "#6B6B6B", subtle: "#9A9A9A", white: "#FFFFFF", orange: "#EB8530", red: "#E04724", gradient: "linear-gradient(135deg, #EB8530 0%, #E04724 100%)", font: "'Helvetica Neue', Helvetica, Arial, sans-serif" };

export function ConfiguracoesClient({ profile, email }: { profile: Profile; email: string }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const rows = [
    { label: "Nome", value: profile.full_name ?? "—" },
    { label: "E-mail", value: email },
    { label: "Plano de leitura", value: PACE_LABELS[profile.pace as keyof typeof PACE_LABELS] ?? profile.pace },
  ];

  return (
    <div style={{ padding: "0 20px 24px", background: S.bg, minHeight: "100vh", fontFamily: S.font }}>
      <div style={{ paddingTop: 56, paddingBottom: 28 }}>
        <p style={{ fontSize: 11, color: S.orange, textTransform: "uppercase" as const, letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>Telos</p>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: S.white, letterSpacing: "-0.8px" }}>Perfil</h1>
      </div>

      {/* Plan badge */}
      <div style={{ background: S.card, borderRadius: 20, padding: "20px", marginBottom: 12, border: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 11, color: S.gray, textTransform: "uppercase" as const, letterSpacing: "0.06em", fontWeight: 600, marginBottom: 4 }}>Plano atual</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: S.white }}>
            {profile.plan_type === "pro" ? "Telos Pro ✓" : "Gratuito"}
          </p>
        </div>
        {profile.plan_type !== "pro" && (
          <button
            onClick={() => router.push("/pro")}
            style={{ background: S.gradient, color: S.white, border: "none", borderRadius: 12, padding: "10px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: S.font }}
          >
            Upgrade →
          </button>
        )}
      </div>

      {/* Info rows */}
      <div style={{ background: S.card, borderRadius: 20, border: `1px solid ${S.border}`, overflow: "hidden", marginBottom: 12 }}>
        {rows.map((row, i) => (
          <div key={row.label} style={{ padding: "16px 20px", borderBottom: i < rows.length - 1 ? `1px solid ${S.border}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 13, color: S.gray }}>{row.label}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: S.white, maxWidth: "60%", textAlign: "right" as const, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{row.value}</p>
          </div>
        ))}
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        style={{ width: "100%", background: "transparent", border: `1px solid #3A1A1A`, color: S.red, borderRadius: 16, padding: "16px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.font }}
      >
        Sair da conta
      </button>
    </div>
  );
}
