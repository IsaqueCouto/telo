"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const S = {
  bg:     "#F7F3EE",
  border: "#E2DBD0",
  gray:   "#8C8279",
  ink:    "#0D0D0B",
  blue:    "#3B82C4",
  serif:  "'Vesper Libre', Georgia, serif",
  sans:   "'Noto Sans', system-ui, sans-serif",
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); return; }
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, phone } } });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user && phone) {
      await supabase.from("profiles").update({ phone }).eq("id", data.user.id);
    }
    router.push("/hoje"); router.refresh();
  }

  const inputStyle: React.CSSProperties = {
    background: "#FFFFFF", border: "1.5px solid #E2DBD0", color: S.ink,
    borderRadius: 12, padding: "15px 16px", fontSize: 15, outline: "none",
    fontFamily: S.sans, width: "100%", transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", background: S.bg, fontFamily: S.sans, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 28px 0" }}>
        {/* Logo */}
        <div style={{ marginBottom: 40 }}>
          <img src="/logo.png" alt="Telos" style={{ height: 44, objectFit: "contain" }} />
        </div>

        <h1 style={{ fontFamily: S.serif, fontSize: 38, fontWeight: 900, color: S.ink, lineHeight: 1.1, letterSpacing: "-0.5px", marginBottom: 8 }}>
          Comece sua<br />jornada.
        </h1>
        <p style={{ fontSize: 15, color: S.gray, marginBottom: 32, fontFamily: S.sans }}>
          Leia a Bíblia inteira. No seu ritmo.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="text"     placeholder="Seu nome"                   value={name}     onChange={(e) => setName(e.target.value)}     required                  autoComplete="name"         style={inputStyle} />
          <input type="email"    placeholder="E-mail"                     value={email}    onChange={(e) => setEmail(e.target.value)}    required                  autoComplete="email"        style={inputStyle} />
          <input type="tel"      placeholder="Telefone (opcional)"        value={phone}    onChange={(e) => setPhone(e.target.value)}                              autoComplete="tel"          style={inputStyle} />
          <input type="password" placeholder="Senha (mínimo 6 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} required               autoComplete="new-password" style={inputStyle} />
          {error && <p style={{ color: "#C0392B", fontSize: 13 }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4, background: loading ? S.border : S.blue, color: "#FFFFFF",
              borderRadius: 12, padding: "16px", fontSize: 15, fontWeight: 700,
              border: "none", cursor: "pointer", fontFamily: S.sans, letterSpacing: "0.01em",
            }}
          >
            {loading ? "Criando conta..." : "Criar conta gratuita"}
          </button>
        </form>
      </div>

      <div style={{ padding: "32px 28px", paddingBottom: "calc(32px + env(safe-area-inset-bottom))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: S.border }} />
          <span style={{ color: S.blue, fontSize: 16 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: S.border }} />
        </div>
        <p style={{ textAlign: "center", fontSize: 14, color: S.gray }}>
          Já tem conta?{" "}
          <Link href="/login" style={{ color: S.blue, fontWeight: 600, textDecoration: "none" }}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}
