"use client";

import React, { useState } from "react";
import { PrayIcon, BookOpenIcon, StarIcon, MicIcon, MusicIcon, LockIcon } from "@/components/icons";

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

const MOODS = [
  { id: "ansioso", label: "Ansioso", verse: "Filipenses 4:6-7", text: "Não andeis ansiosos por coisa alguma; antes em tudo fazei os vossos pedidos conhecidos a Deus por meio de oração...", reflection: "A ansiedade muitas vezes nos faz esquecer que não estamos sozinhos. Deus conhece cada preocupação que você carrega hoje — não precisa carregá-las sozinho. Entregue ao Senhor o que você não consegue resolver, e receba a paz que ultrapassa todo entendimento." },
  { id: "triste",  label: "Triste",  verse: "Salmo 34:18", text: "Perto está o Senhor dos que têm o coração quebrantado e salva os de espírito abatido.", reflection: "Sentir tristeza não é fraqueza — é humano. Deus não se afasta de corações feridos; Ele se aproxima. Você não precisa fingir que está bem; Ele te encontra exatamente onde você está." },
  { id: "grato",   label: "Grato",   verse: "Salmo 100:4", text: "Entrai nos seus átrios com ações de graças, nos seus átrios com hinos. Rendei-lhe graças e bendizei o seu nome.", reflection: "Gratidão é um ato de fé — é reconhecer que as bênçãos não são coincidência. Que hoje você carregue essa leveza no coração, sabendo que as boas dádivas vêm d'Ele." },
  { id: "perdido", label: "Perdido", verse: "Jeremias 29:11", text: "Porque eu bem sei os planos que tenho para vós, diz o Senhor, planos de paz e não de mal, para vos dar um futuro e uma esperança.", reflection: "Quando não sabemos o caminho, é fácil achar que Deus também não sabe. Mas Ele não apenas conhece o caminho — Ele é o caminho. Confie nos planos dEle mesmo quando você não os entende ainda." },
  { id: "cansado", label: "Cansado", verse: "Mateus 11:28", text: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.", reflection: "O cansaço que você sente hoje é real, e Deus o vê. Jesus não pede que você chegue com força — Ele convida exatamente os que estão esgotados. Descanse nEle hoje." },
];

function AnsisoIcon({ active }: { active: boolean }) {
  const c = active ? "#FFF8EE" : "#A0855C";
  return <svg width="30" height="30" viewBox="0 0 34 34" fill="none"><path d="M2 17 L5 17 L7 11 L9 23 L11 13 L13 21 L15 8 L17 26 L19 14 L21 20 L23 17 L27 17 L32 17" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function TristeIcon({ active }: { active: boolean }) {
  const c = active ? "#FFF8EE" : "#A0855C";
  return <svg width="30" height="30" viewBox="0 0 34 34" fill="none"><path d="M9 20 Q8 14 13 13 Q13 8 17 8 Q22 8 22 13 Q26 13 26 18 Q26 21 22 21 L11 21 Q8 21 9 20Z" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/><line x1="12" y1="24" x2="11" y2="28" stroke={c} strokeWidth="1.6" strokeLinecap="round"/><line x1="17" y1="24" x2="16" y2="28" stroke={c} strokeWidth="1.6" strokeLinecap="round"/><line x1="22" y1="24" x2="21" y2="28" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>;
}
function GratoIcon({ active }: { active: boolean }) {
  const c = active ? "#FFF8EE" : "#A0855C";
  return <svg width="30" height="30" viewBox="0 0 34 34" fill="none"><line x1="3" y1="24" x2="31" y2="24" stroke={c} strokeWidth="1.6" strokeLinecap="round"/><path d="M10 24 A7 7 0 0 1 24 24" stroke={c} strokeWidth="1.6" strokeLinecap="round" fill="none"/><line x1="17" y1="7" x2="17" y2="11" stroke={c} strokeWidth="1.6" strokeLinecap="round"/><line x1="8" y1="13" x2="11" y2="15" stroke={c} strokeWidth="1.6" strokeLinecap="round"/><line x1="26" y1="13" x2="23" y2="15" stroke={c} strokeWidth="1.6" strokeLinecap="round"/><line x1="5" y1="21" x2="8" y2="21" stroke={c} strokeWidth="1.6" strokeLinecap="round"/><line x1="29" y1="21" x2="26" y2="21" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>;
}
function PerdidoIcon({ active }: { active: boolean }) {
  const c = active ? "#FFF8EE" : "#A0855C";
  return <svg width="30" height="30" viewBox="0 0 34 34" fill="none"><circle cx="17" cy="17" r="12" stroke={c} strokeWidth="1.6"/><circle cx="17" cy="17" r="1.8" fill={c}/><polygon points="17,6 14.5,15 17,13 19.5,15" fill={c}/><polygon points="17,28 14.5,19 17,21 19.5,19" stroke={c} strokeWidth="1.2" fill="none" strokeLinejoin="round"/><line x1="6" y1="17" x2="9" y2="17" stroke={c} strokeWidth="1.6" strokeLinecap="round"/><line x1="28" y1="17" x2="25" y2="17" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>;
}
function CansadoIcon({ active }: { active: boolean }) {
  const c = active ? "#FFF8EE" : "#A0855C";
  return <svg width="30" height="30" viewBox="0 0 34 34" fill="none"><polyline points="3,27 3,22 9,22 9,17 15,17 15,12 21,12 21,7 27,7" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/><polyline points="24,4 27,7 24,10" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
const MOOD_ICONS: Record<string, (p: { active: boolean }) => React.ReactElement> = {
  ansioso: AnsisoIcon, triste: TristeIcon, grato: GratoIcon, perdido: PerdidoIcon, cansado: CansadoIcon,
};

const CATEGORY_ICONS: Record<string, (color: string) => React.ReactElement> = {
  oracoes:    (c) => <PrayIcon    size={14} color={c} />,
  meditacao:  (c) => <BookOpenIcon size={14} color={c} />,
  versiculos: (c) => <StarIcon    size={14} color={c} />,
  historias:  (c) => <MicIcon     size={14} color={c} />,
  louvor:     (c) => <MusicIcon   size={14} color={c} />,
};
const CATEGORIES = [
  { id: "oracoes",    label: "Orações"    },
  { id: "meditacao",  label: "Meditações" },
  { id: "versiculos", label: "Versículos" },
  { id: "historias",  label: "Histórias"  },
  { id: "louvor",     label: "Louvor"     },
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
          <div style={{ background: S.card, borderRadius: 20, padding: "20px", border: `1px solid ${S.border}` }}>
            <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 4, fontFamily: S.sans }}>Como você está hoje?</p>
            <p style={{ fontFamily: S.serif, fontSize: 15, fontWeight: 700, color: S.ink, marginBottom: 20 }}>Selecione seu estado de espírito</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
              {MOODS.map((m) => {
                const isActive = selectedMood === m.id;
                const Icon = MOOD_ICONS[m.id];
                return (
                  <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                    <button
                      onClick={() => setSelectedMood(isActive ? null : m.id)}
                      style={{
                        width: "100%", aspectRatio: "1", borderRadius: 16,
                        background: isActive ? "#C49A3C" : "#F0EAE0",
                        boxShadow: isActive
                          ? "inset 2px 2px 6px rgba(0,0,0,0.18), inset -1px -1px 3px rgba(255,255,255,0.08)"
                          : "4px 4px 10px rgba(0,0,0,0.09), -2px -2px 6px rgba(255,255,255,0.85), inset 0 1px 0 rgba(255,255,255,0.7)",
                        border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "all 0.18s ease",
                      }}
                    >
                      <Icon active={isActive} />
                    </button>
                    <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? "#C49A3C" : S.gray, fontFamily: S.sans, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
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
                <button style={{ flex: 1, background: S.surface, border: `1px solid ${S.border}`, borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 600, color: S.muted, cursor: "pointer", fontFamily: S.sans, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <LockIcon size={12} color={S.muted} /> Ouvir (Pro)
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
                  {CATEGORY_ICONS[cat.id](isActive ? "#FFFFFF" : "#8C8279")}
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
                <p style={{ fontSize: 13, color: S.muted, fontFamily: S.sans }}>Mais conteúdo chegando em breve</p>
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
