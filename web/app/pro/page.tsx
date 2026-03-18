"use client";

import { useRouter } from "next/navigation";

const S = { bg: "#010101", card: "#1C1C1C", border: "#2A2A2A", surface: "#141414", gray: "#6B6B6B", subtle: "#9A9A9A", white: "#FFFFFF", orange: "#EB8530", gradient: "linear-gradient(135deg, #EB8530 0%, #E04724 100%)", font: "'Helvetica Neue', Helvetica, Arial, sans-serif" };

const FEATURES = [
  { icon: "⚡", title: "Escolha seu ritmo", desc: "Leia em 3 meses, 6 meses ou 1 ano" },
  { icon: "📖", title: "Explicação diária", desc: "Resumo e explicação do que você leu, gerado por IA" },
  { icon: "🏛️", title: "Contexto histórico", desc: "Entenda a época e cultura de cada livro" },
  { icon: "▶️", title: "Vídeos sugeridos", desc: "Links diretos no YouTube para cada leitura" },
  { icon: "✏️", title: "Anotações", desc: "Salve reflexões e insights de cada dia" },
  { icon: "💬", title: "Perguntas de reflexão", desc: "Para estudo individual ou em grupo" },
  { icon: "🛡️", title: "Dia de graça", desc: "Pule 1 dia por semana sem perder o streak" },
];

export default function ProPage() {
  const router = useRouter();

  return (
    <div style={{ background: S.bg, minHeight: "100vh", fontFamily: S.font }}>
      {/* Header */}
      <div style={{ padding: "56px 20px 0" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: S.subtle, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: S.font, marginBottom: 32 }}>
          ← Voltar
        </button>

        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, color: S.orange, textTransform: "uppercase" as const, letterSpacing: "0.08em", fontWeight: 700, marginBottom: 8 }}>Telos Pro</p>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: S.white, letterSpacing: "-1px", lineHeight: 1.05, marginBottom: 12 }}>
            Vá mais fundo<br />na Palavra.
          </h1>
          <p style={{ fontSize: 14, color: S.gray, lineHeight: 1.6 }}>
            Conteúdo exclusivo para transformar sua leitura diária em um estudo real.
          </p>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {FEATURES.map((f) => (
          <div key={f.title} style={{ background: S.card, borderRadius: 16, padding: "16px 20px", border: `1px solid ${S.border}`, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 22, flexShrink: 0, width: 36, textAlign: "center" as const }}>{f.icon}</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: S.white, marginBottom: 2 }}>{f.title}</p>
              <p style={{ fontSize: 12, color: S.gray }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: "0 20px 48px" }}>
        <div style={{ background: S.card, borderRadius: 24, padding: "28px", border: `1px solid ${S.border}`, textAlign: "center" as const }}>
          <p style={{ fontSize: 11, color: S.gray, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 8 }}>Apenas</p>
          <p style={{ fontSize: 52, fontWeight: 900, background: S.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-2px", lineHeight: 1 }}>
            R$14,90
          </p>
          <p style={{ fontSize: 13, color: S.gray, marginTop: 4, marginBottom: 24 }}>por mês · cancele quando quiser</p>
          <button
            style={{ width: "100%", background: S.gradient, color: S.white, border: "none", borderRadius: 16, padding: "18px", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: S.font, letterSpacing: "-0.3px", boxShadow: "0 8px 32px rgba(235,133,48,0.3)" }}
          >
            Assinar Pro
          </button>
          <button style={{ background: "none", border: "none", color: S.gray, fontSize: 12, marginTop: 16, cursor: "pointer", fontFamily: S.font }}>
            Restaurar compra anterior
          </button>
        </div>
      </div>
    </div>
  );
}
