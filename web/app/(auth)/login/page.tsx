"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const S = {
  bg:      "#F7F3EE",
  card:    "#FFFFFF",
  border:  "#E2DBD0",
  gray:    "#8C8279",
  ink:     "#0D0D0B",
  blue:    "#3B82C4",
  serif:   "'Noto Sans', system-ui, sans-serif",
  sans:    "'Noto Sans', system-ui, sans-serif",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError("E-mail ou senha incorretos."); setLoading(false); }
    else { router.push("/hoje"); router.refresh(); }
  }

  const inputStyle: React.CSSProperties = {
    background: "#FFFFFF", border: "1.5px solid #E2DBD0", color: S.ink,
    borderRadius: 12, padding: "15px 16px", fontSize: 15, outline: "none",
    fontFamily: S.sans, width: "100%", transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", background: S.bg, fontFamily: S.sans, display: "flex", flexDirection: "column" }}>
      {/* Top section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 28px 0" }}>
        {/* Logo */}
        <div style={{ marginBottom: 48 }}>
          <img src="/logo.png" alt="Telos" style={{ height: 44, objectFit: "contain" }} />
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: S.serif, fontSize: 38, fontWeight: 900, color: S.ink, lineHeight: 1.1, letterSpacing: "-0.5px", marginBottom: 8 }}>
          Bem-vindo<br />de volta.
        </h1>
        <p style={{ fontSize: 15, color: S.gray, marginBottom: 36, fontFamily: S.sans }}>
          Continue sua jornada pela Palavra.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" style={inputStyle} />
          <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" style={inputStyle} />
          {error && <p style={{ color: "#C0392B", fontSize: 13, fontFamily: S.sans }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4, background: loading ? S.border : S.blue, color: "#FFFFFF",
              borderRadius: 12, padding: "16px", fontSize: 15, fontWeight: 700,
              border: "none", cursor: "pointer", fontFamily: S.sans,
              transition: "background 0.2s", letterSpacing: "0.01em",
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div style={{ padding: "32px 28px", paddingBottom: "calc(32px + env(safe-area-inset-bottom))" }}>
        {/* Divider with ornament */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: S.border }} />
          <span style={{ color: S.blue, fontSize: 16 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: S.border }} />
        </div>
        <p style={{ textAlign: "center", fontSize: 14, color: S.gray, fontFamily: S.sans }}>
          Não tem conta?{" "}
          <Link href="/register" style={{ color: S.blue, fontWeight: 600, textDecoration: "none" }}>
            Criar conta gratuita
          </Link>
        </p>
      </div>
    </div>
  );
}
