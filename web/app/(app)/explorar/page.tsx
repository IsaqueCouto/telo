"use client";

import React, { useState } from "react";
import { PrayIcon, BookOpenIcon, StarIcon, MicIcon, MusicIcon } from "@/components/icons";

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
const MENTE_CATEGORIES = [
  { id: "oracoes",    label: "Orações"    },
  { id: "meditacao",  label: "Meditações" },
  { id: "versiculos", label: "Versículos" },
  { id: "historias",  label: "Histórias"  },
];

const EXOUSIA_VIDEOS = [
  { id: "6q_kEHjPYzI", title: "6 AM Devocional EP. 28 — ft. Evy Guimarães" },
  { id: "2VEqRn7PO2w", title: "6 AM Devocional EP. 27 — ft. Leticia Galdino" },
  { id: "5ClIuzPSiAI", title: "6 AM Devocional EP. 26 — ft. Evy Guimarães" },
  { id: "FC92DAaNhjQ", title: "6 AM Devocional EP. 25 — ft. Leticia Galdino" },
  { id: "Nd9VWM5Wu0o", title: "6 AM Devocional EP. 24 — ft. Bia Luna" },
  { id: "LjX8l9QVeLo", title: "6 AM Devocional EP. 23 — ft. Mikheas Alves" },
  { id: "76Vr_tm6W9E", title: "6 AM Devocional EP. 22 — ft. Tau & Mikheas" },
  { id: "PWxHQRGraSw", title: "6 AM Devocional EP. 21 — ft. Tau & Mikheas" },
  { id: "gUcHCcXhJxw", title: "6 AM Devocional EP. 20 — ft. Tau & Mikheas" },
  { id: "1Yf5KLNkaL0", title: "6 AM Devocional EP. 19 — ft. Tau & Mikheas" },
];

const DUNAMIS_VIDEOS = [
  { id: "SQQ2YJmkMi0", title: "Não Há Outro — Jesus Culture & Dunamis feat. Danielle Vicentini" },
  { id: "BCOMp6r77Qc", title: "Não Há Outro (Ao Vivo) — Dunamis feat. Danielle Vicentini" },
  { id: "qqFG8l4CZK8", title: "Não Há Outro — Dunamis feat. Danielle Vicentini" },
  { id: "rxr3ixO-lVc", title: "Por Uma Nova Geração — The Send Brasil 2026" },
  { id: "CwC1I0NJ6R4", title: "The Send Brasil 2026" },
  { id: "h4tjPgdP2c4", title: "Recap Fornalha Tour 2025" },
  { id: "IP819AkXc90", title: "Fornalha Tour Brasil 2025 — Promo" },
  { id: "NBGsNhBmUcE", title: "The Send Global Recap" },
  { id: "iiIfz8_TXhM", title: "The Send 2026 — Promo" },
  { id: "tp8BjQJ47Z4", title: "Fornalha Tour Brasil 2025 — Teaser" },
];

const CATEGORY_CONTENT = {
  oracoes: [
    {
      tag: "Oração da manhã",
      title: "Começando o dia com Deus",
      body: "Senhor, obrigado por mais um dia. Que eu possa caminhar na sua vontade, ver as pessoas com seus olhos e confiar que o Senhor vai me guiar em cada decisão de hoje. Que minha boca fale o que edifica, e meu coração permaneça perto do teu. Amém.",
    },
    {
      tag: "Oração da noite",
      title: "Descansando sob a tua guarda",
      body: "Pai, entrego nas tuas mãos tudo o que vivi hoje — os acertos e os erros. Obrigado por tua misericórdia que se renova a cada manhã. Enquanto durmo, que o teu amor me cubra e que eu acorde amanhã com forças renovadas. Amém.",
    },
    {
      tag: "Oração nos momentos difíceis",
      title: "Quando a força falta",
      body: "Senhor, hoje estou cansado. Não tenho respostas, só perguntas. Mas sei que o teu poder se aperfeiçoa na fraqueza. Não preciso entender tudo — preciso confiar em ti. Sustenta-me. Seja minha força quando a minha acabar. Amém.",
    },
  ],
  meditacao: [
    {
      tag: "Salmo 23",
      title: "O Senhor é o meu pastor",
      body: "\"O Senhor é o meu pastor; nada me faltará.\" Este salmo não foi escrito em um jardim tranquilo — Davi conhecia a solidão do deserto e o perigo da guerra. E ainda assim declarou: nada me faltará. Não porque a vida era fácil, mas porque ele conhecia o pastor.",
    },
    {
      tag: "Filipenses 4:6-7",
      title: "A paz que excede todo entendimento",
      body: "Paulo escreveu sobre paz de dentro de uma prisão. Quando ele diz \"não andeiais ansiosos\", não é ingenuidade — é uma escolha radical de confiar que Deus é maior do que a nossa situação. A oração não muda apenas as circunstâncias. Ela muda quem ora.",
    },
    {
      tag: "Romanos 8:28",
      title: "Todas as coisas cooperam para o bem",
      body: "Esta promessa não diz que tudo é bom — diz que tudo coopera para o bem. Deus é especialista em usar o que parece ruim para construir algo que ainda não conseguimos ver. O fim da história ainda não foi escrito. Confie no autor.",
    },
  ],
  versiculos: [
    {
      tag: "Sobre paz",
      title: "Versículos para quando a ansiedade chega",
      body: "\"Não andeiais ansiosos por coisa alguma, mas em tudo fazei conhecidos os vossos pedidos a Deus.\" — Filipenses 4:6\n\n\"A paz eu vos deixo, a minha paz vos dou; não a dou como o mundo a dá.\" — João 14:27\n\n\"Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.\" — 1 Pedro 5:7",
    },
    {
      tag: "Sobre força",
      title: "Versículos para os dias difíceis",
      body: "\"Tudo posso naquele que me fortalece.\" — Filipenses 4:13\n\n\"Ele fortalece o cansado e aumenta as forças do que não tem nenhum vigor.\" — Isaías 40:29\n\n\"O Senhor é a minha força e o meu escudo; nele o meu coração confia.\" — Salmo 28:7",
    },
    {
      tag: "Sobre esperança",
      title: "Versículos para renovar a esperança",
      body: "\"Porque eu bem sei os planos que tenho para vós, planos de paz e não de mal.\" — Jeremias 29:11\n\n\"Os que esperam no Senhor renovarão as forças; subirão com asas como águias.\" — Isaías 40:31\n\n\"E a esperança não decepciona, porque o amor de Deus está derramado em nossos corações.\" — Romanos 5:5",
    },
  ],
  historias: [
    {
      tag: "Antigo Testamento",
      title: "José — Da cova ao palácio",
      body: "José foi vendido pelos próprios irmãos, preso injustamente e esquecido — mas em cada etapa, a Bíblia repete: 'O Senhor era com José.' Sua história nos lembra que o sofrimento não é o fim. Deus estava escrevendo um capítulo que José ainda não podia ler. (Gênesis 37–50)",
    },
    {
      tag: "Antigo Testamento",
      title: "Davi — O menino que confiou",
      body: "Davi não enfrentou Golias porque era forte — enfrentou porque tinha memória. Ele se lembrou do leão e do urso que Deus o ajudou a vencer. A fé de Davi era alimentada pela história. Quando você está diante do seu gigante, qual história de Deus você pode lembrar? (1 Samuel 17)",
    },
    {
      tag: "Novo Testamento",
      title: "O filho pródigo — A corrida do pai",
      body: "A parte mais comovente desta parábola não é o retorno do filho — é a corrida do pai. Ele viu o filho de longe, correu, e abraçou antes de ouvir qualquer pedido de desculpas. Esse é Deus. Não esperando com os braços cruzados, mas correndo ao seu encontro. (Lucas 15:11-32)",
    },
  ],
};

export default function ExplorarPage() {
  const [activeTab, setActiveTab]           = useState<"mente" | "musicas">("mente");
  const [selectedMood, setSelectedMood]     = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("oracoes");
  const [activeVideoId, setActiveVideoId]   = useState<string | null>(null);

  const mood = MOODS.find(m => m.id === selectedMood);

  return (
    <div style={{ background: S.bg, minHeight: "100vh", fontFamily: S.sans }}>

      {/* Frosted glass header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(247,243,238,0.82)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(226,219,208,0.45)",
        padding: "calc(env(safe-area-inset-top) + 44px) 24px 0",
      }}>
        <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 6, fontFamily: S.sans }}>Telos</p>
        <h1 style={{ fontFamily: S.serif, fontSize: 32, fontWeight: 900, color: S.ink, letterSpacing: "-0.8px", lineHeight: 1.1, marginBottom: 16 }}>Explorar</h1>

        {/* Floating pill tab switcher */}
        <div style={{ paddingBottom: 16 }}>
          <div style={{
            display: "inline-flex",
            background: "rgba(255,255,255,0.78)",
            borderRadius: 30,
            border: "1px solid rgba(226,219,208,0.55)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
            padding: 4,
            gap: 2,
          }}>
            {(["mente", "musicas"] as const).map((tab) => {
              const label = tab === "mente" ? "Mente" : "Músicas";
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "9px 28px",
                    borderRadius: 26,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: S.sans,
                    fontSize: 14,
                    fontWeight: 700,
                    background: isActive ? S.blue : "transparent",
                    color: isActive ? "#FFFFFF" : S.gray,
                    boxShadow: isActive ? "0 4px 14px rgba(59,130,196,0.35)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MENTE TAB ── */}
      {activeTab === "mente" && (
        <div style={{ padding: "20px 0 100px", display: "flex", flexDirection: "column", gap: 20 }}>

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

            {mood && (
              <div style={{ marginTop: 14, background: S.card, borderRadius: 20, padding: "22px", border: `1px solid ${S.border}`, animation: "fadeSlideIn 0.25s ease" }}>
                <div style={{ borderLeft: `3px solid ${S.blue}`, paddingLeft: 16, marginBottom: 14 }}>
                  <p style={{ fontFamily: S.serif, fontSize: 17, color: "#4A4540", lineHeight: 1.8, fontStyle: "italic" }}>
                    &ldquo;{mood.text}&rdquo;
                  </p>
                </div>
                <p style={{ fontSize: 11, color: S.blue, fontWeight: 700, textAlign: "right" as const, marginBottom: 16, fontFamily: S.sans }}>— {mood.verse}</p>
                <p style={{ fontSize: 14, color: "#4A4540", lineHeight: 1.8, fontFamily: S.sans, marginBottom: 16 }}>{mood.reflection}</p>
                <button
                  onClick={() => {
                    const text = `"${mood!.text}" — ${mood!.verse}\n\n${mood!.reflection}\n\nTelos — leia a Bíblia inteira`;
                    if (navigator.share) navigator.share({ text });
                    else navigator.clipboard?.writeText(text);
                  }}
                  style={{ width: "100%", background: S.surface, border: `1px solid ${S.border}`, borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 600, color: S.gray, cursor: "pointer", fontFamily: S.sans }}
                >
                  Compartilhar no WhatsApp
                </button>
              </div>
            )}
          </div>

          {/* Category pills */}
          <div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 24px", paddingBottom: 4 }} className="no-scrollbar">
              {MENTE_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
                      padding: "9px 16px", borderRadius: 99,
                      background: isActive ? S.blue : S.card,
                      border: `1.5px solid ${isActive ? S.blue : S.border}`,
                      cursor: "pointer", transition: "all 0.2s",
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
            {CATEGORY_CONTENT[activeCategory as keyof typeof CATEGORY_CONTENT]?.map((item, i) => (
              <div key={i} style={{ background: S.card, borderRadius: 16, padding: "20px", border: `1px solid ${S.border}` }}>
                <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8, fontFamily: S.sans }}>{item.tag}</p>
                <p style={{ fontFamily: S.serif, fontSize: 16, fontWeight: 700, color: S.ink, marginBottom: 10 }}>{item.title}</p>
                <p style={{ fontSize: 14, color: "#4A4540", lineHeight: 1.8, fontFamily: S.sans }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MÚSICAS TAB ── */}
      {activeTab === "musicas" && (
        <div style={{ padding: "20px 0 100px", display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Active player */}
          {activeVideoId && (
            <div style={{ padding: "0 24px" }}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                style={{ display: "block", width: "100%", height: 210, border: "none", borderRadius: 16 }}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
              <button onClick={() => setActiveVideoId(null)} style={{ marginTop: 8, fontSize: 12, color: S.blue, background: "none", border: "none", cursor: "pointer", fontFamily: S.sans, fontWeight: 700, padding: 0 }}>
                ✕ Fechar player
              </button>
            </div>
          )}

          {/* Playlist: Exousia Music */}
          <div>
            <div style={{ padding: "0 24px", marginBottom: 12, display: "flex", alignItems: "baseline", gap: 8 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: S.ink, fontFamily: S.sans }}>Exousia Music</p>
              <p style={{ fontSize: 11, color: S.muted, fontFamily: S.sans }}>@exousia_music</p>
            </div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 24px 4px", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
              {EXOUSIA_VIDEOS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVideoId(v.id)}
                  style={{ flexShrink: 0, width: 180, border: "none", cursor: "pointer", padding: 0, background: "none", scrollSnapAlign: "start" } as React.CSSProperties}
                >
                  <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${S.border}` }}>
                    <div style={{ position: "relative", width: 180, height: 101, background: "#111" }}>
                      <img
                        src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                        alt={v.title}
                        width={180} height={101}
                        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85, display: "block" }}
                      />
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(59,130,196,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                          <MusicIcon size={15} color="#FFF" />
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: "8px 10px 10px", background: S.card }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: S.ink, lineHeight: 1.4, fontFamily: S.sans, textAlign: "left" as const, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties}>{v.title}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Playlist: Dunamis Movement */}
          <div>
            <div style={{ padding: "0 24px", marginBottom: 12, display: "flex", alignItems: "baseline", gap: 8 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: S.ink, fontFamily: S.sans }}>Dunamis Movement</p>
              <p style={{ fontSize: 11, color: S.muted, fontFamily: S.sans }}>@DunamisMovement</p>
            </div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 24px 4px", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
              {DUNAMIS_VIDEOS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVideoId(v.id)}
                  style={{ flexShrink: 0, width: 180, border: "none", cursor: "pointer", padding: 0, background: "none", scrollSnapAlign: "start" } as React.CSSProperties}
                >
                  <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${S.border}` }}>
                    <div style={{ position: "relative", width: 180, height: 101, background: "#111" }}>
                      <img
                        src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                        alt={v.title}
                        width={180} height={101}
                        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85, display: "block" }}
                      />
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(59,130,196,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                          <MusicIcon size={15} color="#FFF" />
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: "8px 10px 10px", background: S.card }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: S.ink, lineHeight: 1.4, fontFamily: S.sans, textAlign: "left" as const, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties}>{v.title}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>


        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
