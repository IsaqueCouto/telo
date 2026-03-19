"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { ZapIcon, BookOpenIcon, TempleIcon, PlayCircleIcon, PencilIcon, MessageIcon, ShieldIcon } from "@/components/icons";

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

const FEATURES = [
  { icon: <ZapIcon size={20} color="#3B82C4" />,         title: "Escolha seu ritmo",     desc: "Leia em 3 meses, 6 meses ou 1 ano" },
  { icon: <BookOpenIcon size={20} color="#3B82C4" />,    title: "Explicação diária",      desc: "Resumo e explicação do que você leu, gerado por IA" },
  { icon: <TempleIcon size={20} color="#3B82C4" />,      title: "Contexto histórico",    desc: "Entenda a época e cultura de cada livro" },
  { icon: <PlayCircleIcon size={20} color="#3B82C4" />,  title: "Vídeos sugeridos",       desc: "Links diretos no YouTube para cada leitura" },
  { icon: <PencilIcon size={20} color="#3B82C4" />,      title: "Anotações",              desc: "Salve reflexões e insights de cada dia" },
  { icon: <MessageIcon size={20} color="#3B82C4" />,     title: "Perguntas de reflexão",  desc: "Para estudo individual ou em grupo" },
  { icon: <ShieldIcon size={20} color="#3B82C4" />,      title: "Dia de graça",           desc: "Pule 1 dia por semana sem perder o streak" },
];

export default function ProPage() {
  const router = useRouter();

  return (
    <div style={{ background: S.bg, minHeight: "100vh", fontFamily: S.sans }}>
      {/* Back button */}
      <div style={{ padding: "52px 24px 0" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: S.gray, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: S.sans, padding: 0, marginBottom: 32, display: "flex", alignItems: "center", gap: 6 }}>
          ← Voltar
        </button>

        {/* Hero */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.1em", fontWeight: 700, marginBottom: 10, fontFamily: S.sans }}>Telos Pro</p>
          <h1 style={{ fontFamily: S.serif, fontSize: 42, fontWeight: 900, color: S.ink, letterSpacing: "-1px", lineHeight: 1.05, marginBottom: 14 }}>
            Vá mais fundo<br />na Palavra.
          </h1>
          <p style={{ fontSize: 15, color: S.gray, lineHeight: 1.65, fontFamily: S.sans }}>
            Conteúdo exclusivo para transformar sua leitura diária em um estudo real.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ margin: "0 24px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, height: 1, background: S.border }} />
        <span style={{ color: S.blue, fontSize: 14 }}>✦</span>
        <div style={{ flex: 1, height: 1, background: S.border }} />
      </div>

      {/* Features */}
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 2, marginBottom: 28 }}>
        {FEATURES.map((f, i) => (
          <div key={f.title} style={{ background: S.card, borderRadius: i === 0 ? "16px 16px 4px 4px" : i === FEATURES.length - 1 ? "4px 4px 16px 16px" : 4, padding: "16px 20px", border: `1px solid ${S.border}`, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flexShrink: 0, width: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{f.icon}</div>
            <div>
              <p style={{ fontFamily: S.sans, fontSize: 14, fontWeight: 700, color: S.ink, marginBottom: 2 }}>{f.title}</p>
              <p style={{ fontFamily: S.sans, fontSize: 13, color: S.gray }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: "0 24px 56px" }}>
        <div style={{ background: S.card, borderRadius: 24, padding: "32px 28px", border: `1px solid ${S.border}`, textAlign: "center" as const, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
          <p style={{ fontSize: 12, color: S.muted, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10, fontFamily: S.sans }}>Apenas</p>
          <p style={{ fontFamily: S.serif, fontSize: 60, fontWeight: 900, color: S.blue, letterSpacing: "-3px", lineHeight: 1 }}>
            R$14,90
          </p>
          <p style={{ fontSize: 14, color: S.gray, marginTop: 6, marginBottom: 28, fontFamily: S.sans }}>por mês · cancele quando quiser</p>
          <button
            style={{ width: "100%", background: S.blue, color: "#FFFFFF", border: "none", borderRadius: 14, padding: "18px", fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: S.serif, letterSpacing: "-0.2px", boxShadow: "0 6px 20px rgba(216,104,59,0.35)" }}
          >
            Assinar Pro
          </button>
          <button style={{ background: "none", border: "none", color: S.muted, fontSize: 13, marginTop: 16, cursor: "pointer", fontFamily: S.sans }}>
            Restaurar compra anterior
          </button>
        </div>
      </div>
    </div>
  );
}
