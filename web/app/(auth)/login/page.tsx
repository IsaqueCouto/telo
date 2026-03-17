"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
    } else {
      router.push("/hoje");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between px-6 safe-top safe-bottom" style={{ background: "#010101", paddingTop: "3rem", paddingBottom: "2rem" }}>
      {/* Logo */}
      <div>
        <div className="flex items-baseline gap-1">
          <span style={{ fontSize: 28, fontWeight: 900, color: "#FFFFFF", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", letterSpacing: "-0.5px" }}>
            Telo
          </span>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg, #EB8530, #E04724)", display: "inline-block", marginBottom: 2 }} />
        </div>
        <p style={{ color: "#6B6B6B", fontSize: 13, marginTop: 4 }}>Leia a Bíblia inteira. No seu ritmo.</p>
      </div>

      {/* Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <h1 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1, color: "#FFFFFF", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", letterSpacing: "-1px" }}>
          Bem-vindo<br />de volta.
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={{ background: "#1C1C1C", border: "1px solid #2A2A2A", color: "#FFFFFF", borderRadius: 16, padding: "16px", fontSize: 14, outline: "none", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", width: "100%", boxSizing: "border-box" }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={{ background: "#1C1C1C", border: "1px solid #2A2A2A", color: "#FFFFFF", borderRadius: 16, padding: "16px", fontSize: 14, outline: "none", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", width: "100%", boxSizing: "border-box" }}
          />
          {error && <p style={{ color: "#E04724", fontSize: 13, textAlign: "center" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ background: loading ? "#3A3A3A" : "linear-gradient(135deg, #EB8530 0%, #E04724 100%)", color: "#FFFFFF", borderRadius: 16, padding: "16px", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", marginTop: 4, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", width: "100%" }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p style={{ textAlign: "center", fontSize: 13, color: "#6B6B6B" }}>
        Não tem conta?{" "}
        <Link href="/register" style={{ color: "#EB8530", fontWeight: 600 }}>Criar conta</Link>
      </p>
    </div>
  );
}
