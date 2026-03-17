"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (error) { setError(error.message); setLoading(false); }
    else { router.push("/hoje"); router.refresh(); }
  }

  const inputStyle = { background: "#1C1C1C", border: "1px solid #2A2A2A", color: "#FFFFFF", borderRadius: 16, padding: "16px", fontSize: 14, outline: "none", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", width: "100%", boxSizing: "border-box" as const };

  return (
    <div className="min-h-screen flex flex-col justify-between px-6 safe-top safe-bottom" style={{ background: "#010101", paddingTop: "3rem", paddingBottom: "2rem" }}>
      {/* Logo */}
      <div>
        <div className="flex items-baseline gap-1">
          <span style={{ fontSize: 28, fontWeight: 900, color: "#FFFFFF", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", letterSpacing: "-0.5px" }}>Telo</span>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg, #EB8530, #E04724)", display: "inline-block", marginBottom: 2 }} />
        </div>
        <p style={{ color: "#6B6B6B", fontSize: 13, marginTop: 4 }}>Leia a Bíblia inteira. No seu ritmo.</p>
      </div>

      {/* Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <h1 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1, color: "#FFFFFF", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", letterSpacing: "-1px" }}>
          Comece sua<br />jornada.
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" style={inputStyle} />
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" style={inputStyle} />
          <input type="password" placeholder="Senha (mínimo 6 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" style={inputStyle} />
          {error && <p style={{ color: "#E04724", fontSize: 13, textAlign: "center" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ background: loading ? "#3A3A3A" : "linear-gradient(135deg, #EB8530 0%, #E04724 100%)", color: "#FFFFFF", borderRadius: 16, padding: "16px", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", marginTop: 4, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", width: "100%" }}
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "#6B6B6B" }}>
        Já tem conta?{" "}
        <Link href="/login" style={{ color: "#EB8530", fontWeight: 600 }}>Entrar</Link>
      </p>
    </div>
  );
}
