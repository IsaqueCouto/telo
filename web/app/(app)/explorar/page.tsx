"use client";

import { useState } from "react";

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

const MOODS = [
  { id: "ansioso",  label: "Ansioso",  icon: "🌊", verse: "Filipenses 4:6-7", text: "Não andeis ansiosos por coisa alguma; antes em tudo fazei os vossos pedidos conhecidos a Deus por meio de oração...", reflection: "A ansiedade muitas vezes nos faz esquecer que não estamos sozinhos. Deus conhece cada preocupação que você carrega hoje — não precisa carregá-las sozinho. Entregue ao Senhor o que você não consegue resolver, e receba a paz que ultrapassa todo entendimento." },
  { id: "triste",   label: "Triste",   icon: "🌧", verse: "Salmo 34:18", text: "Perto está o Senhor dos que têm o coração quebrantado e salva os de espírito abatido.", reflection: "Sentir tristeza não é fraqueza — é humano. Deus não se afasta de corações feridos; Ele se aproxima. Você não precisa fingir que está bem; Ele te encontra exatamente onde você está." },
  { id: "grato",    label: "Grato",    icon: "☀️", verse: "Salmo 100:4", text: "Entrai nos seus átrios com ações de graças, nos seus átrios com hinos. Rendei-lhe graças e bendizei o seu nome.", reflection: "Gratidão é um ato de fé — é reconhecer que as bênçãos não são coincidência. Que hoje você carregue essa leveza no coração, sabendo que as boas dádivas vêm d'Ele." },
  { id: "perdido",  label: "Perdido",  icon: "🧭", verse: "Jeremias 29:11", text: "Porque eu bem sei os planos que tenho para vós, diz o Senhor, planos de paz e não de mal, para vos dar um futuro e uma esperança.", reflection: "Quando não sabemos o caminho, é fácil achar que Deus também não sabe. Mas Ele não apenas conhece o caminho — Ele é o caminho. Confie nos planos dEle mesmo quando você não os entende ainda." },
  { id: "cansado",  label: "Cansado", icon: "🌙", verse: "Mateus 11:28", text: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.", reflection: "O cansaço que você sente hoje é real, e Deus o vê. Jesus não pede que você chegue com força — Ele convida exatamente os que estão esgotados. Descanse nEle hoje." },
];

const CATEGORIES = [
  { id: "oracoes",   label: "Orações",    icon: "🙏" },
  { id: "meditacao", label: "Meditações", icon: "📖" },
  { id: "versiculos",label: "Versículos", icon: "✦" },
  { id: "historias", label: "Histórias",  icon: "🎙" },
  { id: "louvor",    label: "Louvor",     icon: "🎵" },
];

export default function ExplorarPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("oracoes");

  const mood = MOODS.find(m => m.id === selectedMood);

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
        <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 6, fontFamily: S.sans }}>Telos</p>
        <h1 style={{ fontFamily: S.serif, fontSize: 32, fontWeight: 900, color: S.ink, letterSpacing: "-0.8px", lineHeight: 1.1 }}>Explorar</h1>
      </div>

      <div style={{ padding: "20px 0 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Mood section */}
        <div style={{ padding: "0 24px" }}>
          <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 12, fontFamily: S.sans }}>Como você está hoje?</p>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }} className="no-scrollbar">
            {MOODS.map((m) => {
              const isActive = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMood(isActive ? null : m.id)}
                  style={{
                    flexShrink: 0,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    padding: "12px 16px",
                    borderRadius: 16,
                    background: isActive ? S.blue : S.card,
                    border: `1.5px solid ${isActive ? S.blue : S.border}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{m.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? "#FFFFFF" : S.gray, fontFamily: S.sans }}>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mood content card */}
          {mood && (
            <div style={{ marginTop: 14, background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}`, animation: "fadeSlideIn 0.25s ease" }}>
              <div style={{ borderLeft: `3px solid ${S.blue}`, paddingLeft: 16, marginBottom: 14 }}>
                <p style={{ fontFamily: S.serif, fontSize: 17, color: "#4A4540", lineHeight: 1.8, fontStyle: "italic" }}>
                  &ldquo;{mood.text}&rdquo;
                </p>
              </div>
              <p style={{ fontSize: 11, color: S.blue, fontWeight: 700, textAlign: "right" as const, marginBottom: 16, fontFamily: S.sans }}>— {mood.verse}</p>
              <p style={{ fontSize: 14, color: "#4A4540", lineHeight: 1.8, fontFamily: S.sans, marginBottom: 16 }}>{mood.reflection}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ flex: 1, background: S.surface, border: `1px solid ${S.border}`, borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 600, color: S.gray, cursor: "pointer", fontFamily: S.sans }}>
                  Compartilhar
                </button>
                <button style={{ flex: 1, background: S.surface, border: `1px solid ${S.border}`, borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 600, color: S.muted, cursor: "pointer", fontFamily: S.sans }}>
                  🔒 Ouvir (Pro)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Category pills */}
        <div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 24px 0", paddingBottom: 4 }} className="no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    flexShrink: 0,
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "9px 16px",
                    borderRadius: 99,
                    background: isActive ? S.blue : S.card,
                    border: `1.5px solid ${isActive ? S.blue : S.border}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 13 }}>{cat.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? "#FFFFFF" : S.gray, fontFamily: S.sans }}>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content cards */}
        <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 10 }}>

          {activeCategory === "louvor" ? (
            /* YouTube playlist embeds */
            <>
              {[
                { label: "Hillsong Worship em Português", query: "Hillsong Worship português" },
                { label: "Fernandinho — Ao Vivo", query: "Fernandinho ao vivo 2024" },
                { label: "Aline Barros — Ressuscita-me", query: "Aline Barros ressuscita-me" },
              ].map((item, i) => (
                <a
                  key={i}
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 14, background: S.card, borderRadius: 16, padding: "16px", border: `1px solid ${S.border}`, textDecoration: "none" }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "#FF0000", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 18, color: "#FFFFFF" }}>▶</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: S.ink, fontFamily: S.sans }}>{item.label}</p>
                    <p style={{ fontSize: 11, color: S.gray, marginTop: 3, fontFamily: S.sans }}>Abrir no YouTube</p>
                  </div>
                </a>
              ))}
            </>
          ) : (
            /* Coming soon for other categories */
            <>
              <div style={{ background: S.card, borderRadius: 16, padding: "20px", border: `1px solid ${S.border}` }}>
                <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8, fontFamily: S.sans }}>Em breve</p>
                <p style={{ fontFamily: S.serif, fontSize: 16, fontWeight: 700, color: S.ink, marginBottom: 8 }}>
                  {activeCategory === "historias" ? "Histórias Bíblicas Narradas" : activeCategory === "oracoes" ? "Orações Guiadas" : activeCategory === "meditacao" ? "Meditações Bíblicas" : "Versículos por Tema"}
                </p>
                <p style={{ fontSize: 13, color: S.gray, lineHeight: 1.6, fontFamily: S.sans }}>
                  {activeCategory === "historias"
                    ? "Histórias da Bíblia narradas em português brasileiro — perfeitas para antes de dormir. Exclusivo Pro."
                    : "Conteúdo guiado baseado nas Escrituras, em português. Chegando em breve."}
                </p>
                {activeCategory === "historias" && (
                  <button style={{ marginTop: 16, width: "100%", background: S.blue, color: "#FFFFFF", border: "none", borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: S.sans }}>
                    Quero saber quando lançar
                  </button>
                )}
              </div>

              <div style={{ background: S.surface, borderRadius: 16, padding: "18px 20px", border: `1px solid ${S.border}`, textAlign: "center" as const }}>
                <p style={{ fontSize: 13, color: S.muted, fontFamily: S.sans }}>Mais conteúdo chegando em breve 🙏</p>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
